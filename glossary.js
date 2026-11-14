/* Concise original definitions; linked lessons carry the full scope and sources. */
(function (root) {
  'use strict';
  root.PHOTO_DATA.glossary = [
    { id: 'ev', title: 'EV / 档：用倍率比较曝光变化', summary: '场景光线不变，快门时间加倍或单独开大一档光圈，曝光量约加倍；曝光补偿指示相机偏离测光建议，不保证主体纹理一定保留。固定 ISO 的 M 模式需直接调整实际参数。', lessonId: 'metering-histogram' },
    { id: 'f-number', title: 'f 值：光圈孔径的相对大小', summary: 'f 数越小通常表示光圈越大；f/2.8 到 f/4 约减少一档进光量。景深还取决于距离、焦距与最终观看条件，不能只看一个 f 数。', lessonId: 'aperture' },
    { id: 'iso', title: 'ISO：亮度呈现与曝光取舍', summary: '提高 ISO 不会让镜头额外收集光。它常用于保持所需快门和光圈时调整输出亮度；噪点判断要连同实际曝光量和后期处理一起看。', lessonId: 'iso' },
    { id: 'raw', title: 'RAW / JPEG：原始记录与已处理图像', summary: 'RAW 为重新解释白平衡和色调保留更多处理空间，JPEG 已经过机内处理与压缩；RAW 也不能保证救回失焦、运动模糊或已丢失的高光。', lessonId: 'sensor-raw' },
    { id: 'af', title: 'One-Shot / Servo：单次与连续对焦', summary: '静物可用单次对焦；距离变化时可用 Servo，在持续激活期间更新对焦。识别框、合焦和曝光期间的清晰度不是同一件事，拍后仍需放大检查。', lessonId: 'af-tracking' },
    { id: 'stabilization', title: 'IS / IBIS：镜头与机身防抖', summary: '防抖主要补偿相机晃动，不会停止人物或树叶运动；可用快门下限需要实拍验证，脚架上的设置应按设备说明确认。', lessonId: 'shutter-stabilization' },
    { id: 'rolling-shutter', title: '滚动快门：不同位置在不同时间读出', summary: '逐行读出下，相机或主体快速运动可能造成形变，闪烁光源可能出现条纹。电子快门是否适合场景，要按机型、光源和运动试拍。', lessonId: 'shutter-stabilization' },
    { id: 'equivalent-focal', title: '等效焦距：比较视角的参照', summary: '等效焦距用于在不同画幅之间比较视角；裁切并不改变镜头实际焦距。保持同一观察位置时，裁切本身不会产生移动机位后的透视关系。', lessonId: 'lens-system' },
    { id: 'depth-field', title: '景深：可接受清晰的距离范围', summary: '景深围绕对焦距离展开，不等于整个画面都一样清楚。近摄、多人合影和风景都应分别检查最近与最远的重要细节。', lessonId: 'aperture' },
    { id: 'white-balance', title: '白平衡：解释光源下的颜色', summary: '白平衡影响中性色与整体冷暖。混合光源照亮的不同区域，往往无法用一个全局设置同时校正；先判断主要光源与表达意图。', lessonId: 'whitebalance' },
    { id: 'histogram', title: '直方图 / 高光剪切：分布与细节的证据', summary: '图表左侧代表暗、右侧代表亮，峰值代表该亮度附近像素较多。峰在中间不是统一目标；边缘像素要结合实际区域、RGB 通道和重要纹理判断。', lessonId: 'metering-histogram' },
    { id: 'magnification', title: '放大倍率：近摄时像有多大', summary: '1:1 表示主体在传感器上成像的尺寸与实物尺寸相同，并不是在屏幕上看起来一样大；最近对焦距离与镜头前端到主体的工作距离不同。', lessonId: 'closeup' },
    { id: 'flash-sync', title: '闪光同步：让曝光与闪光协调', summary: '常规闪光需处于设备支持的同步条件内；高速同步及电子快门支持情况因机型而异。自然光与闪光的占比应分别试拍观察，不能照搬所有机身的同一快门值。', lessonId: 'flash-basics' },
    { id: 'pixels-ppi', title: '像素 / PPI：图像尺寸与打印密度', summary: '像素宽高描述图像采样数量，PPI 描述打印时每英寸排列多少像素。只改 PPI 数值不会增加原片细节，导出须按实际用途核对文件。', lessonId: 'export-backup' },
    { id: 'color-space', title: '色彩空间：颜色编码的参照', summary: 'sRGB 等色彩空间规定颜色编码的解释方式。选择要匹配观看或交付流程，不能认为更大的色彩空间在任何软件中都会自动更好看。', lessonId: 'export-backup' },
    { id: 'contact-sheet', title: '接触表：同时比较一组候选照片', summary: '将候选缩略图并排看，可以比较动作、构图与照片间的关系；再放大关键细节。组照需要各张承担作用，重复照片不一定增加信息。', lessonId: 'photo-series' }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
