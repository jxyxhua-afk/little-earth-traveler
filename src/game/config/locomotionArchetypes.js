export const LOCOMOTION_ARCHETYPES = Object.freeze({
  wheeledVehicle: {
    id: "wheeledVehicle",
    name: "WheeledVehicle",
    coreMotion: "有轮子的载具主要沿地面运动，前进方向要和车头一致，可以转弯、推开障碍、爬小坡。",
    dragBehavior: "拖拽时车身朝向逐渐对齐移动方向，拖拽高度贴近地面，可略微抬起但不能飞起来。",
    releaseBehavior: "松手后保留线速度，沿车头方向继续滑行一段；速度越快，刹车距离越长。",
    collisionBehavior: "撞到轻物体时推开；撞到重物体或护栏时减速、轻微反弹或停下；卡车比小车更能推动重物。",
    soundCue: "轻碰为短促金属声，重撞更低、更厚，轮子可有轻微滚动声。",
    visualCue: "轮子要明显转动或有方向感，车灯、车窗、车头方向要清楚。",
    representativeObjects: ["小汽车", "卡车", "黄色校车", "新干线车厢", "骆驼车", "冰面推车"],
    suitableCountries: ["中国", "埃及", "日本", "美国", "北极"],
    forbiddenPatterns: ["车像盒子一样横着滑", "所有载具统一用同一套拖拽速度", "车头方向不清楚"]
  },
  freeRoller: {
    id: "freeRoller",
    name: "FreeRoller",
    coreMotion: "球形或圆柱物体会自由滚动，受坡度、摩擦、撞击影响。",
    dragBehavior: "可以被抬高，放到车顶、斜坡、积木上方；拖拽时保持自然旋转或轻微晃动。",
    releaseBehavior: "松手后落下、弹起、滚动；高处放下时应明显受重力影响。",
    collisionBehavior: "撞墙后沿护栏滚动或轻微反弹，撞积木时传递动量。",
    soundCue: "弹跳声偏清脆，滚动声轻，重落地时更明显。",
    visualCue: "表面条纹、环线或高光要能显示旋转方向。",
    representativeObjects: ["篮球", "石球", "雪球", "玩具球", "金色太阳球"],
    suitableCountries: ["中国", "埃及", "美国", "澳大利亚", "北极"],
    forbiddenPatterns: ["球不滚，只做平移", "球不能被抬高放置", "球撞墙提前回原点"]
  },
  slider: {
    id: "slider",
    name: "Slider",
    coreMotion: "滑动物体主要受摩擦影响，冰面、沙坡、木板、船身表现不同滑行距离。",
    dragBehavior: "可以沿地面或坡面摆放，拖拽时贴近支撑面，不需要像球一样高抬。",
    releaseBehavior: "松手后根据地面摩擦继续滑行，低摩擦环境滑得远，高摩擦环境停得快。",
    collisionBehavior: "撞到物体后速度衰减，可把轻物体推走。",
    soundCue: "沙地是闷闷的摩擦声，冰面是轻薄滑音，木板是低短擦碰声。",
    visualCue: "可用拖痕、滑线、尘土或冰屑表现运动路径。",
    representativeObjects: ["石块", "莎草船", "冰块", "滑板", "木板", "雪橇"],
    suitableCountries: ["埃及", "北极", "日本", "中国"],
    forbiddenPatterns: ["冰面物体不滑", "沙坡滑行距离和摩擦无关", "滑动物体像普通盒子一样停死"]
  },
  hopper: {
    id: "hopper",
    name: "Hopper",
    coreMotion: "跳跃物体靠弹性或腿部动作离开地面，再落下，核心是起跳、滞空、落地。",
    dragBehavior: "可拖到地面目标点，也可以轻抬后释放；拖拽时身体可压缩，提示蓄力。",
    releaseBehavior: "松手后弹起或跳向目标，落地后继续轻微弹跳。",
    collisionBehavior: "落地或撞到物体时弹回，弹性不能太大，避免飞出场地。",
    soundCue: "轻快弹跳声，落地时有柔和咚声。",
    visualCue: "身体压缩、伸展、影子变化，落地有小星星或尘土。",
    representativeObjects: ["袋鼠", "弹跳球", "企鹅跳", "熊猫跳"],
    suitableCountries: ["澳大利亚", "北极", "中国"],
    forbiddenPatterns: ["跳跃物体没有起跳和落地", "弹性过大飞出场地", "跳跃只用文字解释"]
  },
  projectile: {
    id: "projectile",
    name: "Projectile",
    coreMotion: "抛射物受初速度和重力影响，形成抛物线；角度和力度决定落点。",
    dragBehavior: "可通过拉拽投石机、弹弓或发射器蓄力；拖得越远，发射越强。",
    releaseBehavior: "松手后沿抛物线飞出，不允许直线瞬移到目标。",
    collisionBehavior: "命中积木、目标牌或篮筐时产生冲击；不同重量的投射物破坏力不同。",
    soundCue: "发射声短，飞行声轻，命中声根据材质变化。",
    visualCue: "必须显示弧线预览或飞行轨迹，让孩子理解会落下来。",
    representativeObjects: ["投石机石球", "篮球", "雪球", "玩具炮弹"],
    suitableCountries: ["中国", "美国", "北极"],
    forbiddenPatterns: ["飞行物没有抛物线", "投射物直线瞬移到目标", "没有角度和力度差异"]
  },
  curvedFlight: {
    id: "curvedFlight",
    name: "CurvedFlight",
    coreMotion: "飞行路径不是直线，而是弯曲、回旋或绕行，核心是侧向力和方向变化。",
    dragBehavior: "拖拽时设置投掷方向和力度，可有弧线预览。",
    releaseBehavior: "松手后沿曲线飞行，可能绕回来、擦过目标或回到接球区。",
    collisionBehavior: "碰到目标后减速、弹开或掉落，命中后可触发跳起接住。",
    soundCue: "飞行中有轻微呼啸声，击中目标时短促。",
    visualCue: "飞行轨迹要明显，回旋路径要有彩色尾迹。",
    representativeObjects: ["回旋镖", "纸飞机", "风筝", "飞盘"],
    suitableCountries: ["澳大利亚", "日本", "美国"],
    forbiddenPatterns: ["飞行物没有曲线", "回旋镖不会返回", "没有侧向力带来的方向变化"]
  },
  railRunner: {
    id: "railRunner",
    name: "RailRunner",
    coreMotion: "被轨道约束，只能沿预设线路运动，速度、刹车距离和停车点是核心。",
    dragBehavior: "拖拽可以用于拉动车厢起步、设置速度或切换轨道，不应把车拖离轨道。",
    releaseBehavior: "松手后沿轨道继续运动，速度逐渐衰减或按刹车规则停止。",
    collisionBehavior: "碰到轨道终点、挡板或缓冲区会减速，不应飞出轨道。",
    soundCue: "轨道滚动声、刹车声、到站提示声。",
    visualCue: "轨道线、信号灯、停车区要清楚；刹车时可有轻微火花或速度线。",
    representativeObjects: ["新干线", "小火车", "矿车", "缆车"],
    suitableCountries: ["日本", "中国", "美国"],
    forbiddenPatterns: ["轨道物体可以随意离轨", "速度不影响刹车距离", "停车区和信号灯不清楚"]
  },
  spinner: {
    id: "spinner",
    name: "Spinner",
    coreMotion: "围绕中心轴旋转，转速、摩擦、碰撞后的角速度变化是核心。",
    dragBehavior: "可通过旋转拖拽或拨动启动，拖拽方向决定旋转方向。",
    releaseBehavior: "松手后继续旋转，逐渐减速。",
    collisionBehavior: "旋转物体碰到轻物体时会弹开或扫开，碰到重物体会明显降速。",
    soundCue: "旋转声从快到慢，碰撞时加入短促敲击。",
    visualCue: "必须有条纹或高光显示正在旋转。",
    representativeObjects: ["风车", "转盘", "陀螺", "信号转盘"],
    suitableCountries: ["日本", "美国", "中国"],
    forbiddenPatterns: ["旋转物体没有角速度变化", "没有转速视觉反馈", "旋转碰撞没有影响"]
  },
  heavyRigidProp: {
    id: "heavyRigidProp",
    name: "HeavyRigidProp",
    coreMotion: "重物移动慢、惯性大、难以抬高，但撞击和压迫效果强。",
    dragBehavior: "拖拽跟手慢，有重量感，不能像轻球一样快速飞动。",
    releaseBehavior: "松手后继续短距离滑动或倾倒，停下较慢。",
    collisionBehavior: "能推开轻物体，也能压倒结构，自身不容易被小物体撞开。",
    soundCue: "低沉、厚重、短促，避免刺耳。",
    visualCue: "移动时有尘土、压痕、重心倾斜。",
    representativeObjects: ["石块", "金字塔砖", "长城砖", "冰块", "大木箱"],
    suitableCountries: ["中国", "埃及", "北极"],
    forbiddenPatterns: ["重物和轻物拖拽速度一样", "重物没有惯性", "重物撞击没有压迫感"]
  },
  floater: {
    id: "floater",
    name: "Floater",
    coreMotion: "浮在水面或空气中，移动慢，受推力、风、水流影响。",
    dragBehavior: "拖拽时有延迟跟随，不能刚性贴手。",
    releaseBehavior: "松手后缓慢漂移、摇晃、回正。",
    collisionBehavior: "轻碰会偏移，重碰会旋转或靠边。",
    soundCue: "水面是柔和拍水声，空气中是轻风声。",
    visualCue: "上下浮动、波纹、轻微摇摆。",
    representativeObjects: ["莎草船", "救生圈", "气球", "浮冰"],
    suitableCountries: ["埃及", "北极", "美国"],
    forbiddenPatterns: ["漂浮物刚性贴手", "漂浮物松手后立刻停住", "没有波纹或摇摆反馈"]
  }
});

export const GLOBAL_LOCOMOTION_FORBIDDEN_PATTERNS = Object.freeze([
  "所有物体统一用同一套拖拽速度",
  "车像盒子横着滑",
  "球不滚",
  "冰面物体不滑",
  "飞行物没有曲线",
  "文化物体只当装饰",
  "国家差异只做成颜色、背景、标签差异",
  "用大段文字解释替代可玩的运动反馈"
]);

export function getLocomotionArchetype(archetypeId) {
  return LOCOMOTION_ARCHETYPES[archetypeId] ?? null;
}
