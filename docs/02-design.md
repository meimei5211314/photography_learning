# v1 实施方案

先记录需求，再形成此方案，最后实现代码。

## 信息架构
固定侧栏：学习路线、相机实验室、实战任务、记忆卡片、知识速查。主区顶部显示当前位置、进度和搜索。学习路线以大幅代码风景图和分阶段课程构成；每节进入完整阅读视图。实验室可切换曝光、构图、焦距、白平衡；实战任务以可执行拍摄简报展开；记忆页面先回忆再翻卡。

## 视觉
主题“光影手记 / FIELD NOTES”。温暖纸白底、深松绿文字与按钮、酸橙黄强调、细线框、宽松留白。SVG 绘制山野湖泊、人物和相机；课程图按主题变化。桌面侧栏宽 224px；窄屏切为顶栏与可换行导航。动态图可暂停，减少动态效果时默认停止。

## 技术和模块边界
无构建依赖的 HTML/CSS/原生 JavaScript，普通 script 按顺序加载，兼容 file:// 直接打开；也提供 Node 本地静态服务器。
- index.html / styles.css：语义结构、全局设计和响应式布局。
- data.js：window.PHOTO_DATA = { lessons, tasks, cards, sources }。lesson 字段 id,title,subtitle,stage,minutes,tag,art,intro,sections[{title,body}],steps[],mistakes[],mnemonic,quiz{question,options[],answer,explanation},lab。task 字段 id,title,scene,difficulty,time,description,settings,steps[],criteria[],reflection。card 字段 id,front,back,lessonId。
- labs.js：window.PhotoLabs = { mount(container, initialTab), destroy() }。自主拥有实验室内部 UI、样式前缀 lab-、SVG/Canvas、事件。曝光/构图/焦距/白平衡四标签。纯计算 window.PhotoMath 供测试。
- learning.js：window.PhotoLearning，纯函数复习排期和状态验证，Node 可测试。
- app.js：路由、课程、进度、练习、记忆、备份、搜索和图示。
- tests/：关键曝光和记忆算法测试；验证报告记录实际检查范围。

## 学习机制
每节 8–15 分钟，先说目标，再看图，动手前预测，动手后解释。检查题解释错误原因。完成一节课程将相关卡片加入复习。卡片“再练”10 分钟，“模糊”1 天，“掌握”按 1/3/7/14/30 天推进；首次卡片可立即练习，提前练习不会冒充已到期。实战采用单变量比较和简短费曼复述。

## 验证顺序
检查语法和内容结构 → 单元测试曝光档位/日期排期/导入结构 → 通过本地服务器检查 HTTP → 浏览器检查桌面和窄屏、参数联动、课程测验、持久化、复习和备份 → 记录结果 → Git 提交。只有观察到问题才补充修订方案和修复。
