export const COUNTRY_UI_CONFIG = {
  china: {
    id: "china",
    name: "中国",
    emoji: "🐼",
    shortHint: "去长城积木场玩一玩",
    sceneId: "china"
  },
  egypt: {
    id: "egypt",
    name: "埃及",
    emoji: "🔺",
    shortHint: "去沙地金字塔玩一玩",
    sceneId: "egypt"
  },
  usa: {
    id: "usa",
    name: "美国",
    emoji: "🚌",
    shortHint: "去黄色校车街区玩一玩",
    sceneId: "school-bus-street"
  },
  japan: {
    id: "japan",
    name: "日本",
    emoji: "🗻",
    shortHint: "去富士山小镇看一看",
    sceneId: "fuji-town"
  },
  france: {
    id: "france",
    name: "法国",
    emoji: "🗼",
    shortHint: "去铁塔面包店玩一玩",
    sceneId: "tower-bakery"
  },
  australia: {
    id: "australia",
    name: "澳大利亚",
    emoji: "🦘",
    shortHint: "去袋鼠草地跳一跳",
    sceneId: "kangaroo-field"
  },
  brazil: {
    id: "brazil",
    name: "巴西",
    emoji: "⚽",
    shortHint: "去雨林足球场玩一玩",
    sceneId: "rainforest-football"
  },
  kenya: {
    id: "kenya",
    name: "肯尼亚",
    emoji: "🦒",
    shortHint: "去草原动物园看一看",
    sceneId: "savanna-animals"
  }
};

export function getCountryUiConfig(countryId, marker) {
  const config = COUNTRY_UI_CONFIG[countryId];

  if (config) return config;

  return {
    id: countryId,
    name: marker?.name ?? "新国家",
    emoji: "🌍",
    shortHint: "去小小地图里玩一玩",
    sceneId: `${countryId}-scene`
  };
}
