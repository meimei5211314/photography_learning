# v2 摄影素材署名与使用说明

核验日期：2026-11-13。所有照片均为真实摄影作品，其中景深与用光对照为原作者的拼接图，积木景深图另叠加了光圈图标。许可依据是下列 Wikimedia Commons 文件说明页的图片许可区，而不是页面底部的数据库许可。本站没有生成或伪造拍摄参数。文件保存到项目 `assets/`，离线运行不会请求外部媒体。

## 素材清单

| 本地文件 / ID | 原作品与作者 | 本项目采用的许可 | 保存版本 |
| --- | --- | --- | --- |
| `moraine-lake.jpg` / landscape | [Moraine Lake (Unsplash xr5whzQaers)](https://commons.wikimedia.org/wiki/File:Moraine_Lake_(Unsplash_xr5whzQaers).jpg) — Justine Milton | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Wikimedia 官方 1280 × 953 缩略图；源图于 2016 年发布，早于 Unsplash 许可切换 |
| `camera-dslr.jpg` / camera | [Nikon D850 digital single-lens reflex camera](https://commons.wikimedia.org/wiki/File:Nikon_D850_digital_single-lens_reflex_camera.jpg) — G1MFG at English Wikipedia | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Wikimedia 官方 1280 × 1013 缩略图；从原作者提供的双重许可中选择 CC BY-SA 4.0 |
| `dof-comparison.png` / dof | [Depth-of-field-comparison-side-by-side-small](https://commons.wikimedia.org/wiki/File:Depth-of-field-comparison-side-by-side-small.png) — Alex1ruff（摄影）；MikeRun（拼接与光圈图标） | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | 原始 3479 × 1210 PNG；源照片与光圈图标来源见下文 |
| `aperture-bokeh.jpg` / bokeh | [Aperture and bokeh](https://commons.wikimedia.org/wiki/File:Aperture_and_bokeh.jpg) — Basile Morin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | 原始 2100 × 2832 JPEG，保留 f/1.4 与 f/22 原图标签 |
| `softbox-direct-flash.jpg` / light | [Comparison of softbox to direct flash](https://commons.wikimedia.org/wiki/File:Comparison_of_softbox_to_direct_flash.jpg) — Dazzpedian at English Wikipedia | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Wikimedia 官方 960 × 1275 缩略图 |
| `waterfall-fast.jpg` / waterfallFast | [Waterfall with Fast Shutter](https://commons.wikimedia.org/wiki/File:Waterfall_with_Fast_Shutter.jpg) — Ber'Zophus | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/) | 原始 2048 × 1365 JPEG |
| `waterfall-slow.jpg` / waterfallSlow | [Waterfall with slower shutter speed - panoramio](https://commons.wikimedia.org/wiki/File:Waterfall_with_slower_shutter_speed_-_panoramio.jpg) — olekinderhook | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Wikimedia 官方 1280 × 857 缩略图；原 Panoramio 授权已由 Commons 机器人复核 |

每张照片的原始下载 URL、实际下载 URL、替代文字、尺寸和作者均保存在 `media.js`。原始二进制文件或 Wikimedia 官方缩略图没有经过本项目的离线裁切、滤镜、去水印或 AI 编辑。

## 页面展示与改变标识

- 首页和课程使用 CSS 适配容器，可能只显示原片的一部分。点击或相关实验可以查看更多画面；原始本地文件保留。
- 比较实验通过 CSS 显示原始合成图的上/下或左/右半幅，并允许切换或拖动查看。视窗变化不代表新拍摄，也不宣称照片严格配准。
- 订书机对比的顶部中央以“景深对照”界面标签覆盖原图参数文字，避免分界拼成错误数值；左右独立标签保留作者标注，图下提供完整原图入口。原图文件没有修改。
- 曝光、白平衡与裁切演示是在浏览器中对照片进行临时教学显示处理，不是原作者交付的成片，也不是物理成像仿真。署名不暗示原作者认可本站或显示处理。
- 照片及其展示改编沿用各图对应的许可；其中 CC BY-SA 作品的改编如再分发，需继续使用相同或兼容许可。照片许可独立于网页程序和原创课程文字，不应将整个仓库的统一许可覆盖这些照片。

## 教学证据边界

1. **积木景深图**：原合成图说明确认左图小开口/大景深、右图大开口/小景深。追溯来源为 Alex1ruff 的 [Dof blocks f1 4](https://commons.wikimedia.org/wiki/File:Dof_blocks_f1_4.jpg) 与 [Dof blocks f22](https://commons.wikimedia.org/wiki/File:Dof_blocks_f22.jpg)，均带 Canon EOS 5D Mark II 摄影元数据；叠加的 [Aperture-open](https://commons.wikimedia.org/wiki/File:Aperture-open.svg) 与 [Aperture-closed](https://commons.wikimedia.org/wiki/File:Aperture-closed.svg) 为 MikeRun 的 SVG 图示，全部采用 CC BY-SA 4.0。它是实拍拼接与图示，不是纯粹的单张照片。由于 `f22` 源文件的 EXIF 也显示 f/1.4，与文件名冲突，本站不采用该组具体 f 值，只教授可观察的清晰范围。
2. **订书机图**：上 f/1.4，下 f/22，来源注明使用 Canon EF 50mm f/1.4。观察到构图轻微偏移，因此不声称除光圈外所有变量严格一致。
3. **水果用光图**：来源确认上柔光箱、下直接闪光。阴影边界是教学观察对象；完整灯位、距离和曝光控制记录未提供，不能据此反推准确色温。
4. **水流案例**：快照源 EXIF 和说明为 1/2000 秒，慢照源 EXIF 为 1/25 秒。二者地点、焦距、取景和主体流速不同，展示的是两种真实现象，不能当作受控的快门前后对照。
5. **相机图**：机身正面的圆盖是保护镜头卡口的机身盖，不是镜头。照片用于认识部件，不是购买建议，也不是不同 ISO 的画质实验。
6. **湖泊图**：用于观察环境层次、构图和取景；不引用源页面含混的 ISO 0 字段，不为本片标注虚构拍摄参数。

## 实际检查

逐张通过本地图片查看工具检查了 7 张选定照片，确认主题、对照方向和尺寸。曾下载的电视摄像机候选图不适合相机入门课，未纳入交付素材。下载遇到限流后间隔重试成功；不热链远程图片。
