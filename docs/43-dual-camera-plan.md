# 可选 R7 双机教程实施方案

需求见 docs/42；基线为干净的 3acb732。先写本方案再实施，不推送。

## 数据契约与职责

1. `dual-camera-lessons.js` 在既有两镜课程后追加阶段11三课：dual-body-assignment、dual-body-controls、dual-body-field-workflow。对应任务：dual-body-pairing-test、dual-body-switch-check、dual-body-story。每课至少6段、5步、3误区、自测、两卡和有效先修/任务链接。全站43课/39任务/86卡。导出 `PHOTO_DUAL_LESSONS`，采用既有课程结构，新增来源去重。课程代理负责此文件、docs/44和模块测试，不改共享文件。
2. `dual-camera-data.js` 在新增课程和原 equipment-data.js 后加载，导出独立 `PHOTO_DUAL_CAMERA`，保留 PHOTO_EQUIPMENT 原数据。器材代理负责该文件、docs/45及模块测试。契约：
   - id:'r6-r7', title, checkedAt, intro（明确可选R7）。
   - keyPoints:[{title,body}]；preferredPairing:[{body,lens,role,start,check}]。
   - combinations:[{body,lens,recording,view,pixels,note}] 四组，像素须写尺寸/记录模式条件。
   - controls:[{id,title,r6,r7,steps:string[],check}]，独立机型操作，不引用未核实菜单页号。
   - scenarios:[{id,title,pairing,settings:string[],checks:string[],changeWhen,lessonId}]，6个场景。
   - workflow:[{title,steps:string[]}]；quickCheck:string[]；practicePairs:[[lessonId,taskId],...3组]；sources:[{title,url,note}]。
   - 先校验课程/任务引用再修改来源索引；防重复加载，不接触学习状态。
3. `equipment-guide.js/css` 保留原单机呈现；mount(container, profileId) 通过原生链接在 #kit 与 #kit/r6-r7 间切换。双机页由上述独立数据渲染，展示四组表、两机分工、机型操作、6场景、3课程任务与拍摄归档流程。资料缺失时显示可用原配置或明确提示，不抛异常。UI代理负责界面、模块测试、scripts/check-browser.cjs，不改共享 app/index/search。
4. 根代理负责 app/index/search 的集成、阶段11、入口文案、README、40课基线兼容契约、共享测试和docs/46。搜索的第8个可选参数接受双机数据，旧调用保持可用；新增搜索结果类别“可选双机”，href=#kit/r6-r7。界面不持久化器材选择，不改变存储。

## 内容重点

- 主线分工是教学建议，以拍摄目的验证，不作购买推荐。R7＋50需要更多工作距离；R6＋18–150仍是裁切，并不获得全幅18mm广角。R7无再次1.6裁切步骤。
- 记录像素采用官方普通静止图像尺寸，区分有效像素、记录像素与导出像素；不直接由像素数保证画质，也不将不同机位比较归因于镜头透视。
- AF/MF物理开关与环职责分开；两机默认拨轮不同；同名模式不代表同一配置。实际固件/自定义入口以机身可见项目核对。
- 双机统一拍摄时间与白平衡意图，使用机身分目录避免同名覆盖；同一尺寸输出比较，保留源文件和机身/镜头元数据。不保证同K值同色彩，不跨机载入配置文件。

## 验证与提交

- 新模块语义检查；完整旧40课/36任务/80卡的身份、测验、检查项、状态恢复契约；所有内链与搜索结果可达。
- 浏览器增加双机页/三课/三任务/阶段筛选/搜索/来回切换/刷新/手机表格/键盘与存储不变检查，保留已有异常回归。
- 全量Node测试、根目录JS语法、git diff检查；桌面与手机截图目视后构建。小步本地提交，最后重建并确认 version.json 对应最终HEAD。

## 验证发现与修正

先登记原因、修复及验证方式，再改动。

- 器材数据自查发现“R7从拍摄→白平衡设置”末尾的动词“设置”容易被当作菜单名，造成与R6 III的“白平衡设置→白平衡”混淆。修复为“R7入口为拍摄→白平衡”，保留R6 III完整路径；对照两机官方白平衡页复核，并在模块测试确认两机入口区别。
- 102路由首轮浏览器检查通过后，目视390px双机页发现主标题末尾“工”单字独占第二行。仅为双机标题增加 `text-wrap: balance` 均衡换行，保留原标题与内容。修改后定向检查390px标题布局、页面无横向溢出，并保存/目视更新的手机截图；不因这一局部排版变动重复全部异常回归。
- 根代理复核均衡换行截图后发现“两机”仍被拆在两行。按冒号将标题分成两个可换行的短语块，使“如果增加 R7：”与“两机两镜如何分工”各自完整；数据标题和可访问名称不变。继续定向检查手机与桌面标题、无溢出，并复核界面模块测试。
