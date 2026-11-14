# photography_learning · 光影手记

中文交互摄影教程。从真实照片开始，通过对照、参数实验、看图判断、实拍任务与主动回忆掌握摄影。

## 内容增强：从现场判断到作品交付

现有 **22 节课程、18 个实战任务、44 张记忆卡、6 个场景案例**。新增第 5 阶段“诊断与交付”：

- **测光与直方图**：分清亮度分布、重要高光、曝光补偿和场景反差，用实拍对照验证。
- **清晰度排障**：区分失焦、景深不足、主体拖影与相机抖动，每次只改变一个主要变量。
- **风光与长曝光**：检查近景/远景、稳定支撑、流水/枝叶运动和亮暗取舍。
- **导出与备份**：从使用目的选择像素尺寸和色彩空间，检查导出副本，实际验证独立备份能否恢复。
- **现场排障**：从自己观察到的症状进入检查步骤，再回到相应课程和实拍任务；它不自动分析上传照片。
- **看图训练与复盘**：新增人像、逆光、合影、街头与后期判断；任务可追加复盘模板，保留原有笔记。
- **全站搜索**：课程、实拍任务、场景案例与排障统一检索。

学习进度继续使用原有备份格式。保存失败会持续提示；检测到其他标签页修改时暂停覆盖，允许先导出本页记录，再载入最新记录。建议同一时间在一个标签页记录学习；浏览器存储不提供数据库级的跨页事务。

## R6 三代与完整拍摄案例

以佳能 **EOS R6 Mark III（R6 三代）** 为操作实例，结合真实摄影素材、互动实验与主动回忆。

- **R6 三代指南**：8 步上手，理解 Av / Tv / M＋自动 ISO、人物眼睛检测与 Servo、快门类型、RAW＋JPEG、回放与 C1–C3。配方说明选择理由和调整条件。
- **6 个完整案例**：窗边人像、户外逆光、多人合影、白天街头、夜街人物、三张叙事。每例连接拍摄意图、起点、现场执行、构图、故障诊断、后期与任务记录。
- **进阶构图**：视觉主次、前中后景、边缘与遮挡、留白、机位和组照关系。用实拍与现有构图裁切实验练习。
- **后期学习**：以佳能 DPP 的 RAW 流程为入口，对照 Lightroom 的常用概念；新增原图/调整图交互工作台和后期顺序练习。网页只进行 JPEG 屏幕演示，不解码 CR3。
- **记忆与进度**：每课有自测和两张卡片，区分阅读与答对，继续使用间隔复习。保留所有原课程/任务/卡片 ID、旧任务检查项及 v1/v2 备份。

镜头以全画幅常用 24–105mm 范围与 f/4 为易迁移的练习起点，按手中镜头可用光圈调整；这些是练习条件，不是器材购买清单。照片为观察参考，不宣称它们由 R6 三代或案例参数拍摄。学习记录不会上传。

## 在线学习与自动发布

访问 **[光影手记在线版](https://meimei5211314.github.io/photography_learning/)**。相机指南、摄影案例与互动实验直接在浏览器运行。

每次推送到 `main`（包括合并分支）后，[GitHub Actions](https://github.com/meimei5211314/photography_learning/actions/workflows/pages.yml) 自动执行测试、打包和 Pages 发布；测试失败不会覆盖当前网站。也可在该工作流页面点击 **Run workflow** 手动重发。仓库 **Settings → Pages → Source** 使用 **GitHub Actions**。

日常更新：

```powershell
git add <本次修改的文件>
git commit -m "更新教程内容"
git push origin main
```

本地提交需要 `push` 后才会触发发布。发布完成前会继续显示上一版；完成后刷新网页。可通过站点 [version.json](https://meimei5211314.github.io/photography_learning/version.json) 的 `commit` 核对线上源码版本。发布失败时在 Actions 查看失败步骤，修复后推送或重跑。

在线加载需要网络，完整下载版仍可离线使用。在线地址与本地文件/本地服务器的学习记录不互通：先在原页面“数据备份”导出 JSON，再在在线版导入。记录只保存在当前浏览器，不会上传到 GitHub；正常发布不会主动清空同一地址的记录。请定期导出备份。

部署需求与方案见 `docs/14-pages-deployment-plan.md`。产物仅含页面、样式、脚本、图片、署名及版本信息，不含开发服务器、测试、截图和个人备份。

## 本地打开

双击 `index.html` 可用普通浏览器打开，使用时保留完整项目文件夹。也可启动本地 HTTP 服务：

```powershell
Set-Location 'D:\Workspace\11_Learning\photography_learning'
node server.cjs
```

打开 http://127.0.0.1:4173 。只监听本机；按 Ctrl+C 停止。如端口占用，先运行 `$env:PORT=4174`。

`file://`、HTTP、不同端口和不同浏览器的本地存储可能不互通。长期学习建议固定一种打开方式，定期从“数据备份”导出 JSON。项目不需要 npm 安装、外部图片服务、在线字体或账号。

## 专题入口

本地服务启动后可直接打开：

- `http://127.0.0.1:4173/#camera`：R6 三代指南
- `http://127.0.0.1:4173/#cases`：人像、街拍与叙事案例
- `http://127.0.0.1:4173/#edit`：后期练习工作台
- `http://127.0.0.1:4173/#lesson/composition-story`：构图进阶课程
- `http://127.0.0.1:4173/#diagnose`：现场排障
- `http://127.0.0.1:4173/#lesson/metering-histogram`：测光与直方图
- `http://127.0.0.1:4173/#lesson/landscape-long-exposure`：风光与长曝光
- `http://127.0.0.1:4173/#lesson/export-backup`：导出与备份

## 推荐学习方式

1. **先看**：观察课程照片，先描述看见的现象，不急着背参数。
2. **再比**：打开实拍对比，固定看同一细节；解释哪些变量改变了。
3. **做判断**：完成自测和看图训练，读懂证据，不只记正确选项。
4. **去拍**：每次只改变一个变量，按任务标准检查作品并写复盘。
5. **隔天想**：先不看解释主动回忆，再核对。每次十几分钟，长期重复。

卡片掌握后间隔 1、3、7、14、30 天；模糊为 1 天；再练为 10 分钟。一天指连续 24 小时，打开网页时重算，不发送系统通知。这是可执行的练习安排，不是个人遗忘曲线预测，也不承诺几天精通。

## 真实照片与模拟的边界

同场景对照与跨场景例子分别标注。曝光亮度与白平衡处理是基于原片的屏幕模拟，不能恢复不存在的 RAW 信息，也不表示这张照片实际由当前参数拍摄。固定机位的焦距演示是裁切，不能表现走动机位的透视变化。静态照片不会因为调整快门而真实产生主体运动，运动现象请结合实拍样例和拍摄练习理解。

摄影素材作者、出处、许可和处理说明见 `docs/07-media-credits.md`、`docs/12-v3-media-credits.md` 及站内“知识速查”。**素材许可证只适用于对应图片**，不自动赋予整个项目相同许可。保留署名与许可证链接后再分发；CC BY-SA 图片衍生内容继续按相应许可分享。

## 文件结构

```text
index.html / styles.css     主界面、排版和响应式布局
app.js                      路由、课程、自测、任务、进度和备份
data.js / advanced-data.js  基础/专题课程、任务、记忆卡与案例
field-data.js                诊断与交付课程、任务和回忆卡
field-guide.js / .css        现场症状排查与练习入口
search.js                    全站内容索引与搜索
progress-store.js            保存结果与跨标签页变更检测
media.js / media-v3.js      摄影素材映射与可检查的署名元数据
assets/                    本地真实摄影素材
guides.js / guides.css     R6 三代操作与场景案例
editing-lab.js / .css      后期对照与顺序练习
labs.js / labs.css          真实案例对比与相机实验室
visual-practice.js / .css   看图与情境判断训练
learning.js                 状态迁移、复习排期和导入校验
server.cjs                  零依赖本地静态服务器
scripts/build-pages.cjs     Pages 公开文件打包脚本
.github/workflows/pages.yml 自动测试与发布工作流
.github/workflows/validate.yml PR 验证与打包（不发布）
tests/                      内容、排期、媒体和关键计算检查
docs/                       需求、方案、资料、素材许可、验证记录
AGENTS.md                   后续协作规则
```

## 维护与验证

每次设计前先更新需求，再写方案，然后修改代码、验证、提交 Git。本轮需求见 `docs/16-completeness-requirements.md`，方案见 `docs/17-completeness-plan.md`，新增事实来源见 `docs/18-completeness-sources.md`，验证结果见 `docs/19-completeness-verification.md`。不覆盖用户记录；存储格式异常时保留原始内容，允许导出以便恢复。

```powershell
node --test --test-isolation=none tests/*.test.cjs
node --check app.js
node --check labs.js
node --check visual-practice.js
node --check advanced-data.js
node --check guides.js
node --check editing-lab.js
node scripts/build-pages.cjs
```

CI 使用 Node.js 24，本轮本地验证使用 Node.js 25.7.0，详见验证记录。个人 JSON 备份建议保存到 Git 忽略的 `backups/` 目录。main 分支源码推送后通过 GitHub Actions 自动发布到 GitHub Pages，学习数据仍只保存在浏览器。

向 main 提交的 PR 会单独运行只读权限的验证与打包，不调用 Pages 部署。开发时可选运行 `node scripts/check-browser.cjs`；该检查需要测试环境提供 Playwright（可通过 `PLAYWRIGHT_MODULE` 指定模块路径、`BROWSER_EXECUTABLE` 指定 Chromium 路径），不增加站点运行依赖。截图输出到 Git 忽略的 `.validation/browser/`。

## 机型与软件资料

R6 三代事实以 [佳能中文高级用户指南](https://cam.start.canon/zh/C022/manual/html/index.html) 核对，日期 2026-11-13。该手册注明适用于固件 1.1.0 或更新版本；这不是最新固件版本声明。教程默认按未改动的控制分配描述，自定义按钮与实际固件可能不同。逐项章节见 `docs/11-v3-camera-sources.md`。

相机操作图是原创逻辑示意，非机身布局或菜单截图。DPP 与 Lightroom 的功能名称并不完全一致；按课程中的相应软件入口核对。保留 RAW 原件、编辑记录与独立备份，导出另一个文件作为交付。
