/* Photographs, photographic composites, or Wikimedia thumbnails. See docs/07-media-credits.md. */
(function (root) {
  'use strict';
  const assets = {
    landscape: {
      src: 'assets/moraine-lake.jpg', width: 1280, height: 953,
      alt: '冰碛湖岸边的彩色独木舟、常绿树林与远处雪山，近处石块和远处山峰形成空间层次',
      title: '湖岸、树林与远山', author: 'Justine Milton',
      source: 'https://commons.wikimedia.org/wiki/File:Moraine_Lake_(Unsplash_xr5whzQaers).jpg',
      license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Moraine_Lake_%28Unsplash_xr5whzQaers%29.jpg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Moraine_Lake_%28Unsplash_xr5whzQaers%29.jpg/1280px-Moraine_Lake_%28Unsplash_xr5whzQaers%29.jpg',
      note: '真实风景照片；使用 Wikimedia 提供的 1280px 缩略图。用于观察层次、取景和冷暖，不将网页处理参数当作原片拍摄参数。'
    },
    camera: {
      src: 'assets/camera-dslr.jpg', width: 1280, height: 1013,
      alt: '尼康 D850 单反相机机身正面，镜头卡口安装保护盖，可见握柄、快门按钮和机身拨轮',
      title: '相机机身：按钮、握柄与镜头卡口', author: 'G1MFG at English Wikipedia',
      source: 'https://commons.wikimedia.org/wiki/File:Nikon_D850_digital_single-lens_reflex_camera.jpg',
      license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Nikon_D850_digital_single-lens_reflex_camera.jpg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Nikon_D850_digital_single-lens_reflex_camera.jpg/1280px-Nikon_D850_digital_single-lens_reflex_camera.jpg',
      note: '使用 Wikimedia 的 1280px 缩略图；选择原作者提供的 CC BY-SA 4.0 许可。图片仅用于认识相机结构，不代表器材购买建议，也不是 ISO 画质对照。'
    },
    dof: {
      src: 'assets/dof-comparison.png', width: 3479, height: 1210,
      alt: '同一积木排列的左右对照：左图前后积木较清晰，右图前方绿色积木清晰而后排逐渐模糊',
      title: '同一排列，较深与较浅的景深', author: 'Alex1ruff（摄影）；MikeRun（拼接与光圈图标）', kind: 'photo-composite',
      source: 'https://commons.wikimedia.org/wiki/File:Depth-of-field-comparison-side-by-side-small.png',
      license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Depth-of-field-comparison-side-by-side-small.png',
      downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Depth-of-field-comparison-side-by-side-small.png',
      note: '实拍拼接与光圈图示。左为较深景深，右为较浅景深。原照片由 Alex1ruff 拍摄；部分源文件名与 EXIF 光圈值冲突，本站不引用具体 f 值。来源明细见素材署名文档。页面可分别显示左右半幅。'
    },
    bokeh: {
      src: 'assets/aperture-bokeh.jpg', width: 2100, height: 2832,
      alt: '同一红色订书机的上下对照：上图标注 f/1.4 且办公背景虚化，下图标注 f/22 且背景更容易辨认',
      title: '红色订书机：f/1.4 与 f/22', author: 'Basile Morin', kind: 'photo-composite',
      source: 'https://commons.wikimedia.org/wiki/File:Aperture_and_bokeh.jpg',
      license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Aperture_and_bokeh.jpg',
      downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Aperture_and_bokeh.jpg',
      note: '原图上半幅 f/1.4，下半幅 f/22；参数来自作者说明与原图标签。两图构图有轻微偏移，适合观察虚化，不能当作逐像素对齐或完整受控实验。保留原始文件与标签。'
    },
    light: {
      src: 'assets/softbox-direct-flash.jpg', width: 960, height: 1275,
      alt: '红苹果与紫色李子的上下用光对照：上图柔光箱照明的阴影边缘较柔和，下图直闪的暗影边界明显',
      title: '同一静物：柔光箱与直接闪光', author: 'Dazzpedian at English Wikipedia', kind: 'photo-composite',
      source: 'https://commons.wikimedia.org/wiki/File:Comparison_of_softbox_to_direct_flash.jpg',
      license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Comparison_of_softbox_to_direct_flash.jpg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Comparison_of_softbox_to_direct_flash.jpg/960px-Comparison_of_softbox_to_direct_flash.jpg',
      note: '使用 Wikimedia 的 960px 缩略图；上半幅柔光箱，下半幅直接闪光，顺序由原作者说明确认。构图略有偏移；只观察阴影过渡，不根据水果颜色反推光源色温或相机白平衡。'
    },
    waterfallFast: {
      src: 'assets/waterfall-fast.jpg', width: 2048, height: 1365,
      alt: '近距离瀑布流水被短曝光记录成清晰的水片和水滴，水流边缘呈不规则凝固形状',
      title: '1/2000 秒记录水流瞬间', author: "Ber'Zophus",
      source: 'https://commons.wikimedia.org/wiki/File:Waterfall_with_Fast_Shutter.jpg',
      license: 'CC BY-SA 2.5', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Waterfall_with_Fast_Shutter.jpg',
      downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Waterfall_with_Fast_Shutter.jpg',
      note: '原始照片；作者说明与 EXIF 均记录 1/2000 秒（f/4、ISO 400、70 mm）。拍摄于多伦多动物园。与本站较慢快门瀑布照地点和构图不同，属于独立案例，不是单变量对照。'
    },
    waterfallSlow: {
      src: 'assets/waterfall-slow.jpg', width: 1280, height: 857,
      alt: '树林里的多级瀑布，水流在较长曝光中呈现连续的白色条带，周围岩石保留细节',
      title: '1/25 秒记录流动痕迹', author: 'olekinderhook',
      source: 'https://commons.wikimedia.org/wiki/File:Waterfall_with_slower_shutter_speed_-_panoramio.jpg',
      license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Waterfall_with_slower_shutter_speed_-_panoramio.jpg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Waterfall_with_slower_shutter_speed_-_panoramio.jpg/1280px-Waterfall_with_slower_shutter_speed_-_panoramio.jpg',
      note: '使用 Wikimedia 的 1280px 缩略图；源 EXIF 记录 1/25 秒（f/14、ISO 500、28 mm）。拍摄于宾夕法尼亚州。与快速快门照片不同地点；快门效果还依赖流速、距离和取景比例。'
    }
  };
  const media = {
    assets,
    hero: 'landscape',
    lessonImages: {camera:'camera',exposure:'landscape',aperture:'dof',shutter:'waterfallFast',iso:'camera',focus:'bokeh',lens:'landscape',composition:'landscape',light:'light',whitebalance:'light',modes:'camera',workflow:'landscape'},
    comparisons: [
      {id:'bokeh', assetId:'bokeh', layout:'vertical-pair', beforeLabel:'f/1.4 · 原图上半幅', afterLabel:'f/22 · 原图下半幅', title:'光圈变化，背景的存在感也变了', description:'原图由作者标注 f/1.4 与 f/22。观察背景杂物是否容易辨认，再想想你希望保留多少环境信息。两幅构图略有偏移，此处没有对图像重绘或模拟虚化。', aspect:2100/(2832/2)},
      {id:'depth', assetId:'dof', layout:'horizontal-pair', beforeLabel:'较深景深 · 左半幅', afterLabel:'较浅景深 · 右半幅', title:'同一排列，清晰范围不同', description:'真实照片拼接并叠加光圈图示。观察第二排到最后一排积木：右图前景清晰、后景更模糊。部分源元数据有冲突，因此只观察清晰范围，不引用具体 f 值；背景虚化也不等于整张失焦。', aspect:3479/2/1210},
      {id:'light', assetId:'light', layout:'vertical-pair', beforeLabel:'柔光箱 · 原图上半幅', afterLabel:'直接闪光 · 原图下半幅', title:'同一静物，不同的阴影边缘', description:'观察苹果左下方的投影边缘：柔光的明暗过渡较缓，直闪的阴影更硬。原作者给出的照明方式不同；照片未提供完整灯位、距离和曝光控制记录。', aspect:960/(1275/2)}
    ]
  };
  root.PHOTO_MEDIA = media;
  if (typeof module === 'object' && module.exports) module.exports = media;
})(typeof window !== 'undefined' ? window : globalThis);
