import { LOCOMOTION_ARCHETYPES } from "./locomotionArchetypes.js";

export const COUNTRY_GAMEPLAY_MATRIX = Object.freeze([
  {
    countryId: "china",
    countryName: "中国",
    coreVerb: "修 + 防",
    locomotionArchetypeId: "projectile",
    mainScene: "长城积木场",
    culturalSymbols: ["长城", "熊猫", "竹林", "烽火台", "投石机"],
    physicsFocus: ["碰撞冲击", "材料强度", "抛体运动"],
    playerGoal: "实时修复城墙，同时用熊猫投石机防御。",
    successCondition: "城墙补齐，烽火台亮起，熊猫挥手，获得长城守护章。",
    failureCondition: "城墙未补齐，或投石机防御没有形成可玩的抛体反馈。",
    keyObjects: ["长城砖", "熊猫", "竹林", "烽火台", "投石机", "软球"],
    forbiddenSimilarities: ["不能只是撞积木再整理", "不能和埃及一样只堆方块", "不能把投石机做成装饰"],
    implementationPriority: 1
  },
  {
    countryId: "egypt",
    countryName: "埃及",
    coreVerb: "装 + 滑",
    locomotionArchetypeId: "slider",
    mainScene: "沙地金字塔",
    culturalSymbols: ["金字塔", "石块", "尼罗河", "莎草船", "骆驼"],
    physicsFocus: ["斜坡摩擦", "重心堆叠"],
    playerGoal: "装载石块，滑下斜坡，堆叠成金字塔。",
    successCondition: "金字塔成型，太阳升起，骆驼铃响，获得金字塔建造章。",
    failureCondition: "石块没有经过装载和滑行过程，或金字塔堆叠没有重心差异。",
    keyObjects: ["金字塔砖", "石块", "尼罗河", "莎草船", "骆驼", "沙坡"],
    forbiddenSimilarities: ["不能只是中国长城积木换成金字塔颜色", "不能所有石块像普通盒子", "不能没有斜坡摩擦差异"],
    implementationPriority: 2
  },
  {
    countryId: "japan",
    countryName: "日本",
    coreVerb: "赛 + 停",
    locomotionArchetypeId: "railRunner",
    mainScene: "新干线停车场",
    culturalSymbols: ["新干线", "富士山", "樱花", "信号灯", "鸟居"],
    physicsFocus: ["惯性", "刹车距离", "轨道约束"],
    playerGoal: "轨道竞速，精准停车并识别信号灯。",
    successCondition: "新干线停准站台，乘客小灯亮起，樱花飘落，获得新干线车长章。",
    failureCondition: "新干线无法沿轨道受约束运动，或速度不影响刹车距离。",
    keyObjects: ["新干线", "轨道", "富士山", "樱花", "信号灯", "鸟居", "站台"],
    forbiddenSimilarities: ["不能做成自由拖拽小车", "不能离开轨道乱跑", "不能没有精准停车目标"],
    implementationPriority: 3
  },
  {
    countryId: "usa",
    countryName: "美国",
    coreVerb: "跑 + 投",
    locomotionArchetypeId: "wheeledVehicle",
    mainScene: "校车篮球街区",
    culturalSymbols: ["黄色校车", "篮球", "汉堡店", "公路", "自由女神像"],
    physicsFocus: ["相对运动", "抛物线", "弹性碰撞"],
    playerGoal: "驾驶校车躲避障碍，移动中投篮。",
    successCondition: "篮球进框，校车到站，汉堡店灯牌亮起，获得校车篮球章。",
    failureCondition: "校车没有跑动感，或移动中投篮和静止投篮没有落点差异。",
    keyObjects: ["黄色校车", "篮球", "汉堡店", "公路", "自由女神像", "篮筐"],
    forbiddenSimilarities: ["不能只是静态美国物体展柜", "不能只有点击介绍", "不能让篮球没有抛物线"],
    implementationPriority: 5
  },
  {
    countryId: "australia",
    countryName: "澳大利亚",
    coreVerb: "飞 + 返",
    locomotionArchetypeId: "curvedFlight",
    mainScene: "回旋镖草原",
    culturalSymbols: ["回旋镖", "袋鼠", "草原", "悉尼歌剧院", "考拉"],
    physicsFocus: ["曲线飞行", "侧向力", "弹跳"],
    playerGoal: "投掷回旋镖击中目标后跳起接住。",
    successCondition: "回旋镖回到手里，袋鼠跳起，草原目标翻牌，获得回旋镖章。",
    failureCondition: "回旋镖没有曲线返回路径，或袋鼠接住动作没有时机要求。",
    keyObjects: ["回旋镖", "袋鼠", "草原目标", "悉尼歌剧院", "考拉"],
    forbiddenSimilarities: ["不能用直线飞行替代回旋", "不能只做袋鼠装饰", "不能没有飞返目标"],
    implementationPriority: 6
  },
  {
    countryId: "arctic",
    countryName: "北极",
    coreVerb: "撞 + 拆",
    locomotionArchetypeId: "heavyRigidProp",
    mainScene: "冰屋工程场",
    culturalSymbols: ["冰面", "企鹅", "冰块", "雪坡", "冰屋", "北极光"],
    physicsFocus: ["动量传递", "低摩擦", "卡扣结构"],
    playerGoal: "推冰块撞击拆旧冰屋，再用碎冰重建。",
    successCondition: "冰屋重建，北极光亮起，企鹅跳舞，获得冰屋工程章。",
    failureCondition: "冰块没有低摩擦滑行，或撞击关键点不能影响冰屋结构。",
    keyObjects: ["冰面", "企鹅", "冰块", "雪坡", "冰屋", "北极光", "碎冰块"],
    forbiddenSimilarities: ["不能只是普通方块撞墙", "不能没有低摩擦冰面", "不能只靠整理恢复结构"],
    implementationPriority: 4
  }
]);

export function listCountryGameplayMatrix() {
  return COUNTRY_GAMEPLAY_MATRIX;
}

export function getCountryGameplay(countryId) {
  return COUNTRY_GAMEPLAY_MATRIX.find((country) => country.countryId === countryId) ?? null;
}

export function validateCountryGameplayMatrix() {
  const errors = [];
  const coreVerbCounts = new Map();
  const archetypeIds = new Set();
  const requiredTextFields = [
    "countryId",
    "countryName",
    "coreVerb",
    "locomotionArchetypeId",
    "mainScene",
    "playerGoal",
    "successCondition",
    "failureCondition"
  ];
  const requiredListFields = [
    "culturalSymbols",
    "physicsFocus",
    "keyObjects",
    "forbiddenSimilarities"
  ];

  for (const country of COUNTRY_GAMEPLAY_MATRIX) {
    const countryLabel = country.countryId || country.countryName || "unknown-country";

    for (const field of requiredTextFields) {
      if (!country[field]) {
        errors.push(`${countryLabel}: ${field} is required`);
      }
    }

    for (const field of requiredListFields) {
      if (!Array.isArray(country[field]) || country[field].length === 0) {
        errors.push(`${countryLabel}: ${field} is required`);
      }
    }

    if (!LOCOMOTION_ARCHETYPES[country.locomotionArchetypeId]) {
      errors.push(`${countryLabel}: missing locomotion archetype ${country.locomotionArchetypeId}`);
    }

    if (country.coreVerb) {
      coreVerbCounts.set(country.coreVerb, (coreVerbCounts.get(country.coreVerb) ?? 0) + 1);
    }

    if (country.locomotionArchetypeId) {
      archetypeIds.add(country.locomotionArchetypeId);
    }
  }

  for (const [coreVerb, count] of coreVerbCounts.entries()) {
    if (count > 1) {
      errors.push(`coreVerb duplicated: ${coreVerb}`);
    }
  }

  if (archetypeIds.size < 3) {
    errors.push("locomotionArchetypeId values are too similar across the six worlds");
  }

  return {
    ok: errors.length === 0,
    errors
  };
}
