/* Open-license photographic additions. Load after media.js. See docs/12-v3-media-credits.md. */
(function (root) {
  'use strict';
  const media = root.PHOTO_MEDIA;
  if (!media || !media.assets) throw new Error('media-v3.js requires media.js');
  Object.assign(media.assets, {
    portrait: {
      src: 'assets/portrait-window.jpg', width: 960, height: 1440,
      alt: '窗边的竖幅半身人像，人物穿黑色上衣，绿色树叶背景虚化，脸部、手臂与明亮窗框形成不同明暗层次',
      title: '窗边人像：让视线停在眼睛', author: 'Andrey Maximov', kind: 'photograph',
      source: 'https://commons.wikimedia.org/wiki/File:Portrait_at_the_window.jpg',
      license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Portrait_at_the_window.jpg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Portrait_at_the_window.jpg/960px-Portrait_at_the_window.jpg',
      note: '真实摄影，使用 Wikimedia 官方 960px 缩略图；源图署名为 Andrey Maximov，CC BY 2.0 已经 Commons Flickr 导入核验。观察脸部与背景的明暗、眼神光、虚化和明亮窗框；不声称灯位或反光板布置已知。不是 EOS R6 Mark III 样片，课程参数为另行练习的起点。'
    },
    portraitBacklight: {
      src: 'assets/portrait-backlight.jpg', width: 1280, height: 859,
      alt: '逆光下手持相机的人物背向观者，发丝和手臂边缘有明亮轮廓，左上方强光与红绿色镜头眩光进入画面',
      title: '逆光人像：发丝轮廓与眩光', author: 'Yuli Aquino', kind: 'photograph',
      source: 'https://commons.wikimedia.org/wiki/File:Back_And_Flare_(56823712).jpeg',
      license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Back_And_Flare_%2856823712%29.jpeg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Back_And_Flare_%2856823712%29.jpeg/1280px-Back_And_Flare_%2856823712%29.jpeg',
      note: '真实摄影，使用 Wikimedia 官方 1280px 缩略图；源页记载由 Archive Team 从 500px 以 CC BY 3.0 导入。可观察发丝和手臂轮廓光、左上高亮与眩光，不能将不可见的正面眼睛描述为正确曝光或对焦。不是 EOS R6 Mark III 样片；课程练习参数不代表原片参数。'
    },
    portraitGroup: {
      src: 'assets/portrait-group.jpg', width: 2048, height: 1365,
      alt: '单色海滩家庭合影，四人前后错开行走，前景母女较清楚，后方父子明显虚化，人物与海岸形成斜线',
      title: '多人站位：前后距离与清晰范围', author: 'Alex Timothy', kind: 'photograph',
      source: 'https://commons.wikimedia.org/wiki/File:Green_Family_Portrait_(47307464).jpeg',
      license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Green_Family_Portrait_%2847307464%29.jpeg',
      downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Green_Family_Portrait_%2847307464%29.jpeg',
      note: '真实摄影，保存 Commons 所提供的原 JPEG；源页记载由 Archive Team 从 500px 以 CC BY 3.0 导入。四人前后错开，后排虚化是可观察结果；这不是全员清晰的合影示范。用来讨论如果目标改为人人清楚，应如何调整站位、景深并放大回放检查；不将原作者的表达选择简单判作失败。不是 EOS R6 Mark III 样片。'
    },
    street: {
      src: 'assets/street-vendor.jpg', width: 1280, height: 960,
      alt: '白天街边摊车旁聚集着穿红色、橙色与紫黄色衣服的人，右侧一名行人从前景走过，后方可见商铺、阳台和树影',
      title: '街边摊车：人物、动作与环境', author: 'Kumar Mangal Roy', kind: 'photograph',
      source: 'https://commons.wikimedia.org/wiki/File:Street_photography.jpeg',
      license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Street_photography.jpeg',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Street_photography.jpeg/1280px-Street_photography.jpeg',
      note: '真实街头摄影，拍摄地由作者说明为印度 Sonarpur；使用 Wikimedia 官方 1280px 缩略图。照片可见摊车旁的人物关系、鲜明衣服色彩和靠近右边缘的行人，不据此编造人物身份、对话或故事。原图为手机拍摄，不是 EOS R6 Mark III 样片。'
    },
    streetNight: {
      src: 'assets/street-night.jpg', width: 1280, height: 961,
      alt: '暮色中的阿姆斯特丹路口，暖色街灯和车灯照亮道路，右侧有电车，前景骑车人带有明显运动模糊，上方天空偏冷色',
      title: '夜间路口：灯光与流动', author: 'Fons Heijnsbroek', kind: 'photograph',
      source: 'https://commons.wikimedia.org/wiki/File:2017_-_free_download_photo_of_a_night_street_view_with_people_walking_and_biking,_cars_and_trams_with_lights_at_the_crossing_of_the_Plantage_Middenlaan_and_Kerklaan,_Amsterdam_winter._Street_photography_CC0_by_Fons_Heijnsbroek.tif',
      license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/2017_-_free_download_photo_of_a_night_street_view_with_people_walking_and_biking%2C_cars_and_trams_with_lights_at_the_crossing_of_the_Plantage_Middenlaan_and_Kerklaan%2C_Amsterdam_winter._Street_photography_CC0_by_Fons_Heijnsbroek.tif',
      downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/2017_-_free_download_photo_of_a_night_street_view_with_people_walking_and_biking%2C_cars_and_trams_with_lights_at_the_crossing_of_the_Plantage_Middenlaan_and_Kerklaan%2C_Amsterdam_winter._Street_photography_CC0_by_Fons_Heijnsbroek.tif/lossy-page1-1280px-thumbnail.tif.jpg',
      note: '真实摄影，使用 Wikimedia 从作者 TIFF 生成的官方 JPEG 缩略图，未下载巨大的原 TIFF。观察暖灯与冷天空、亮部和暗部、前景骑车人的流动痕迹；不承诺网页调亮可以恢复灯光高光。不是 EOS R6 Mark III 样片，练习参数不作为原片参数。'
    }
  });
  for (const lesson of root.PHOTO_DATA?.lessons || []) {
    if (lesson.mediaId) media.lessonImages[lesson.id] = lesson.mediaId;
  }
})(typeof window !== 'undefined' ? window : globalThis);
