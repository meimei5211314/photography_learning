# 第三版新增素材署名

核验与下载日期：2026-11-13。新增五张真实摄影作品，均从 Wikimedia Commons 的文件说明页确认图片许可，使用其官方 JPEG 缩略图或原始 JPEG。实际下载 URL、原始 URL、尺寸、作者、许可与说明保存在 `media-v3.js`。本轮未复制佳能官方商品照片或手册截图。

| ID / 文件 | 原作与作者 | 许可 | 本地尺寸 |
| --- | --- | --- | --- |
| portrait / `assets/portrait-window.jpg` | [Portrait at the window](https://commons.wikimedia.org/wiki/File:Portrait_at_the_window.jpg)，Andrey Maximov | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)；Commons 于 2012-10-28 对 Flickr 来源许可进行了核验 | 960 × 1440 |
| portraitBacklight / `assets/portrait-backlight.jpg` | [Back And Flare](https://commons.wikimedia.org/wiki/File:Back_And_Flare_(56823712).jpeg)，Yuli Aquino | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)；Commons 由 Archive Team 从 500px 导入，文件页链接原来源及存档 | 1280 × 859 |
| portraitGroup / `assets/portrait-group.jpg` | [Green Family Portrait](https://commons.wikimedia.org/wiki/File:Green_Family_Portrait_(47307464).jpeg)，Alex Timothy | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)；Commons 由 Archive Team 从 500px 导入，文件页链接原来源及存档 | 2048 × 1365 |
| street / `assets/street-vendor.jpg` | [Street photography](https://commons.wikimedia.org/wiki/File:Street_photography.jpeg)，Kumar Mangal Roy（源页用户名 Kumar_Mangal_Roy） | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)；作者自行上传并授权 | 1280 × 960 |
| streetNight / `assets/street-night.jpg` | [Night street view in Amsterdam](https://commons.wikimedia.org/wiki/File:2017_-_free_download_photo_of_a_night_street_view_with_people_walking_and_biking,_cars_and_trams_with_lights_at_the_crossing_of_the_Plantage_Middenlaan_and_Kerklaan,_Amsterdam_winter._Street_photography_CC0_by_Fons_Heijnsbroek.tif)，Fons Heijnsbroek | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)；作者自行上传并授权 | 1280 × 961 |

## 展示与处理

本地文件保持官方缩略图或原始 JPEG 原样，没有离线裁切、磨皮、调色或 AI 编辑。页面可以通过 CSS 适配容器；后期实验室对其进行的临时曝光、对比、饱和度或冷暖显示须标为“教学调整”。作者署名与许可应随图提供，不暗示作者或被摄者认可本教程。照片许可独立于程序代码许可。

夜街原始 TIFF 约 75 MB，本项目保存的是 Wikimedia 提供的约 234 KB JPEG 缩略图；无需下载整幅 TIFF 即可离线学习。五张本地文件总计 1,466,800 字节；新增逆光人像为 285,969 字节，家庭合影为 333,435 字节。

## 看图证据与课程迁移

1. **portrait**：黑衣人物位于窗边，背景是绿色虚化树叶；眼睛有小高光，脸比亮窗框和部分手臂暗。适合比较视线落点、背景分离、裁切明亮边缘、保留自然明暗。不是户外人像，也不能从图像推断反光板或灯具的位置。源页标注 Canon EOS 30D；不得当作 R6 Mark III 样片。
2. **street**：中央为有篷推车，左侧红衣、中间橙衣、右侧紫黄衣人物形成色彩关系；最右侧前景行人接近画面边缘，后方有卷帘、店招、阳台和树影。适合研究人物关系、环境交代、颜色呼应与边缘控制。只能描述可见动作，不编造人物关系或情绪。源 EXIF 是 Redmi 4 手机；这张照片同时说明构图观察不依赖特定机身。
3. **streetNight**：冷色暮空与暖街灯并存，右侧有电车，路面可见轨道/箭头，近处骑车人存在明显运动模糊。适合讨论保留夜感、混合光、灯光高光和动作表达。源 EXIF 有 1/25 秒记录，但课程的快门起点是给学习者的独立建议；不得替换原片元数据，不将运动模糊一概判为失败。
4. **portraitBacklight**：人物侧后方背向观者，手持相机；头顶、发丝及手臂有明亮轮廓，左上强光进入画面，并形成红/绿眩光。适合观察逆光分离与高亮干扰；正面眼睛不可见，不能用它证明脸部或眼睛曝光、对焦是否正确。源页为 Nikon D80 摄影，不能作佳能样片。
5. **portraitGroup**：单色海滩照片中四人前后错开，前景母女较清楚，后排父子明显虚化。适合诊断“如果目标改成全员清楚，站位与景深应如何调整”，不应标为全员清晰的成功示范，也不把作者有意的虚化叙事判作错误。源页为 Canon EOS 60D 摄影，不能作 R6 Mark III 样片。

所有素材均已通过本地图片查看逐张检查。下载仅用于已授权的项目集成，不在网页热链远程图片。其色彩/明暗是原作者交付成片的外观，不能反推准确的现场白平衡、光比或完整后期配方。
