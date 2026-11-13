# v2 实施方案 · 先观察照片，再理解参数

## 媒体策略
真实摄影是现象证据；SVG 是原理解释；交互负责控制变量与反馈。不为了动画而增加运动。优先 Wikimedia Commons 明确开放许可的作品，保存本地原图或平台提供的缩图，不擅自对图像做离线编辑。真实对照图通过页面定位展示，必须明确原图布局与来源。后期滤镜只能被标成教学模拟，不代表真实曝光或景深。

## 模块与接口
- 新增 media.js：window.PHOTO_MEDIA；assets: { [id]: {src,alt,title,author,source,license,licenseUrl,note} }，hero 键指向一个 asset id，lessonImages 映射 lessonId→assetId；comparisons 是可用对照资料，按素材实际情况补充并记录。
- labs.js / labs.css：保留 PhotoLabs.mount/destroy、PhotoMath 以及现有 exposure/composition/focal/whitebalance 路由；加入 compare。默认入口改为真实案例对比。新实验以摄影照片为基础，可做同场景对照、静态图片曝光/白平衡教学处理、固定机位裁切、构图参考线。按需重绘，停止无意义的常驻动画。明确静态照片不能用快门滑杆展示主体运动，运动概念用真实对照解释。
- 新增 visual-practice.js / visual-practice.css：PhotoPractice.mount(container,{onResult,results}) / destroy()，至少 6 道看图/情境题，作答后给出证据与迁移提示，下一题主动推进；onResult({id,correct,lessonId}) 由 app 保存，不触碰原始照片。
- learning.js / tests：state version2 增加 diagnostics map（题目 ID→最近结果布尔）；接受 v1 备份并迁移，保留 completed/tasks/reviews/quiz。scheduleReview 增加 options.practiceOnly，提前自由练习不得推迟已有到期日期；首次自由练习可安排复习。复习排序优先到期较久/再练卡，交错不同课程。
- app.js / styles.css：真实照片首页与课程头图；课程保留图解作为可展开解释，阅读字体至少 15px；新增看图训练路由与首页学习建议；区分已阅读、已答对和待复习。最新答题错误写为 false 并引导相关课程。修复失效存储读取后覆盖原始数据风险。资料页展示完整媒体署名。

## 视觉与交互
延续纸白与松绿，照片承担主视觉；明确的照片说明和阅读层级，减少英语装饰和过小字。图片固定比例、懒加载、声明尺寸；比较控件键盘可调且触屏可用。关键反馈使用文本而非只变色。不自动播放视频或叠加无关动画。

## 文件协作
主代理负责 app.js / styles.css / index.html / 文档 / Git。媒体代理负责 assets/、media.js、docs/07-media-credits.md。实验代理负责 labs.js/css 及实验测试。学习代理负责 learning.js、相关测试、visual-practice.js/css。各自改动前读本方案，新增问题先补充方案再修复。

## Git 与发布
现有本地 main 含 v1；远端 main 只有 README 初始化提交 7321a04。保留远端历史，通过普通合并（必要时允许无共同祖先），README 保留完整项目使用说明与原仓库标题含义。不强推。先推送前检查无用户数据/凭据、媒体许可、无工作文件；提交优化后设置 origin 为用户指定地址，正常推送 main 并核对远端 SHA。

## 验证
在隔离测试数据上检查 v1→v2 迁移、提前练习日程、最近答题记录、对比边界与重置、素材全部存在和许可证元数据、全站语法；浏览器检查桌面/手机首屏、照片加载、对比拖动、判断反馈、实验参数、持久化和备份。记录已完成与未能完成的验证，不把示意当成实拍参数标定。
