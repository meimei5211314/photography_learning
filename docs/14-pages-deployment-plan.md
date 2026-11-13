# GitHub Pages 部署需求与实施方案

日期：2026-11-13

## 需求与验收

用户要求把 `meimei5211314/photography_learning` 发布为 GitHub 网页，并在每次提交推送后自动同步。目标地址为 https://meimei5211314.github.io/photography_learning/ 。保留当前静态教程、中文体验、图片署名与浏览器学习记录。

验收标准：公开地址正常访问；相机指南、案例、后期互动及图片在项目子路径正常加载；推送 main 自动执行测试、构建和部署；失败的测试阻止发布；可以手动重新发布；线上版本可以对应 Git 提交。

“自动同步”指 GitHub 收到 main 分支的 push，包含合并进入 main。只在本地 commit 尚未 push 不触发；学习记录继续保存在浏览器，不随源码同步。

## 当前检查

仓库公开，默认分支 main，Actions 已启用，Pages 尚未创建。所有页面资源均为相对路径，路由使用 hash，无需 history 重写。运行时约 8.62 MB，没有安装依赖或后端服务。在线与本地属于不同来源，旧进度通过现有 JSON 导出/导入迁移。

## 实施方案

1. 使用 GitHub Pages 的 GitHub Actions 发布模式，不引入其他托管平台。
2. 工作流监听 main 的 push 与 workflow_dispatch。构建任务用 Node.js 24 执行全部现有测试，然后生成 `_site/`；部署任务依赖构建成功，使用 github-pages 环境与 Pages/OIDC 最小权限。并发部署互斥，避免中途取消正在进行的发布；密集推送时 GitHub 可能合并等待中的运行，最终发布最新版本，不承诺逐提交按队列发布。
3. 增加零依赖打包脚本：从 index.html 收集本地 CSS/JS，复制 assets 和两份图片署名文件；拒绝目录越界与符号链接；输出 .nojekyll 和 version.json。只发布运行文件及署名，不发布开发服务、测试、Git、个人备份、截图和其他开发文档。产物目录加入 Git 忽略。
4. 固定 GitHub 官方 Actions 的已核实提交 SHA，保留主版本注释，避免标签意外漂移。
5. 更正侧栏“本地学习 · 无需联网”为“进度保存在此浏览器”；使用说明明确在线加载需要网络，下载版仍支持离线；补充在线网址、进度迁移、发布排错与日常更新命令。
6. 设置 Pages，提交并推送，检查 Actions 实际成功，核对线上 version.json 与 Git HEAD；访问首页和专题、检查静态资源与页面截图。

## 验证中发现的说明问题

现有“本地学习 · 无需联网”在在线版会误导，项目没有 service worker。修复侧栏和使用说明；检查在线描述与下载版离线能力均准确。不会更改 localStorage 键或学习数据结构。

## 参考

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/rest/pages/pages
- https://github.com/actions/starter-workflows/blob/main/pages/static.yml
