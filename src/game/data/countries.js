const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const GLOBE_MARKERS = [
  { id: "china", name: "中国", greeting: "你好", lat: 35, lon: 103, color: "#ff7d66" },
  { id: "usa", name: "美国", greeting: "Hello", lat: 38, lon: -97, color: "#ffd166" },
  { id: "japan", name: "日本", greeting: "こんにちは", lat: 36, lon: 138, color: "#ff9fb2" },
  { id: "france", name: "法国", greeting: "Bonjour", lat: 46, lon: 2, color: "#65c7f2" },
  { id: "australia", name: "澳大利亚", greeting: "Hello", lat: -25, lon: 133, color: "#7ed957" },
  { id: "egypt", name: "埃及", greeting: "Ahlan", lat: 26, lon: 30, color: "#ffc857" },
  { id: "brazil", name: "巴西", greeting: "Olá", lat: -14, lon: -51, color: "#37b96d" },
  { id: "kenya", name: "肯尼亚", greeting: "Jambo", lat: 0.5, lon: 37.9, color: "#8bd66b" }
];

export const COUNTRIES = {
  usa: {
    id: "usa",
    name: "美国",
    greeting: "Hello",
    language: "英语",
    greetingIntro: "英语里的“你好”是 Hello",
    starsTotal: 6,
    theme: {
      sky: "#bfe3ff",
      ground: "#eef4f1",
      accent: "#4f74c9",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.4, 2.8, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "city",
        name: "城市区",
        hint: "看看美国的代表建筑",
        camera: {
          position: [-3.1, 2.2, 3.9],
          target: [-1.55, 0.75, -0.55]
        },
        items: ["liberty", "flag"]
      },
      {
        id: "school",
        name: "学校路",
        hint: "找到黄色校车",
        camera: {
          position: [-2.4, 1.8, 3.2],
          target: [-1.25, 0.45, 0.75]
        },
        items: ["bus"]
      },
      {
        id: "street",
        name: "街区餐厅",
        hint: "看看街边常见的食物",
        camera: {
          position: [2.5, 1.9, 3.3],
          target: [1.35, 0.55, 0.65]
        },
        items: ["burger"]
      },
      {
        id: "playground",
        name: "运动场",
        hint: "找到会弹跳的球",
        camera: {
          position: [2.7, 2.0, 2.8],
          target: [1.3, 0.5, -1.15]
        },
        items: ["basketball"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句美国的问候语",
        camera: {
          position: [0.2, 2.0, 3.2],
          target: [0, 0.55, 0]
        },
        items: ["hello"]
      }
    ],
    environment: [
      { type: "box", zone: "school", position: [-1.5, 0.04, 0.82], size: [1.8, 0.08, 0.92], color: "#e7eef5" },
      { type: "box", zone: "street", position: [1.35, 0.04, 0.72], size: [1.45, 0.08, 0.82], color: "#fff4d6" },
      { type: "box", zone: "playground", position: [1.35, 0.04, -1.18], size: [1.55, 0.08, 0.9], color: "#dff5d1" },
      { type: "box", position: [-0.15, 0.02, 0.2], size: [5.4, 0.04, 0.18], color: "#cdd9e4" },
      { type: "box", position: [0.62, 0.035, 0.21], size: [0.5, 0.03, 0.035], color: "#ffffff" },
      { type: "box", position: [1.35, 0.035, 0.21], size: [0.5, 0.03, 0.035], color: "#ffffff" },
      { type: "tree", zone: "playground", position: [2.45, 0, -1.45], color: "#7ed957" },
      { type: "tree", zone: "street", position: [2.65, 0, 0.32], color: "#8bd66b" },
      { type: "box", zone: "playground", position: [1.3, 0.28, -1.7], size: [1.2, 0.08, 0.08], color: "#ffffff" }
    ],
    items: [
      {
        id: "liberty",
        name: "自由女神像",
        fallbackType: "liberty",
        model: assetUrl("/models/liberty.glb"),
        sound: assetUrl("/audio/liberty.wav"),
        position: [-2.05, 0, -0.75],
        scale: 1,
        labelOffset: [0, 1.7, 0],
        intro: "我是自由女神像，我在美国纽约，手里举着火炬。"
      },
      {
        id: "flag",
        name: "美国国旗",
        fallbackType: "flag",
        model: assetUrl("/models/flag.glb"),
        sound: assetUrl("/audio/flag.wav"),
        position: [-1.1, 0.02, -0.55],
        scale: 0.8,
        labelOffset: [0, 1.15, 0],
        intro: "我是美国国旗，有红白条纹和蓝色星星。"
      },
      {
        id: "bus",
        name: "黄色校车",
        fallbackType: "bus",
        model: assetUrl("/models/bus.glb"),
        sound: assetUrl("/audio/bus.wav"),
        position: [-1.55, 0, 0.85],
        scale: 0.95,
        labelOffset: [0, 1.05, 0],
        intro: "我是黄色校车，美国小朋友常坐我去学校。"
      },
      {
        id: "burger",
        name: "汉堡",
        fallbackType: "burger",
        model: assetUrl("/models/burger.glb"),
        sound: assetUrl("/audio/burger.wav"),
        position: [1.25, 0.1, 0.75],
        scale: 0.82,
        labelOffset: [0, 0.9, 0],
        intro: "我是汉堡，有面包、肉饼、芝士和蔬菜。"
      },
      {
        id: "basketball",
        name: "篮球",
        fallbackType: "basketball",
        model: assetUrl("/models/basketball.glb"),
        sound: assetUrl("/audio/basketball.wav"),
        position: [1.35, 0.12, -1.05],
        scale: 0.85,
        labelOffset: [0, 0.9, 0],
        intro: "我是篮球，拍一拍我会砰砰跳。"
      },
      {
        id: "hello",
        name: "Hello",
        fallbackType: "welcomeSign",
        model: assetUrl("/models/hello.glb"),
        sound: assetUrl("/audio/hello.wav"),
        position: [0, 0.08, 0.08],
        scale: 1,
        labelOffset: [0, 0.95, 0],
        intro: "Hello 是英语里的你好。"
      }
    ]
  },

  brazil: {
    id: "brazil",
    name: "巴西",
    greeting: "Olá",
    language: "葡萄牙语",
    greetingIntro: "葡萄牙语里的“你好”是 Olá",
    starsTotal: 8,
    theme: {
      sky: "#bfe3ff",
      ground: "#dff5d1",
      accent: "#37b96d",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.2, 3.0, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "rainforest",
        name: "雨林区",
        hint: "看看热带雨林里有什么",
        camera: {
          position: [-2.8, 2.1, 3.6],
          target: [-1.55, 0.55, -0.45]
        },
        items: ["rainforest", "parrot", "river"]
      },
      {
        id: "football",
        name: "足球区",
        hint: "找到巴西人喜欢的运动",
        camera: {
          position: [2.8, 2.0, 3.7],
          target: [1.45, 0.45, 0.65]
        },
        items: ["football", "goal"]
      },
      {
        id: "music",
        name: "音乐区",
        hint: "听听热闹的巴西节奏",
        camera: {
          position: [2.7, 2.1, 2.6],
          target: [1.25, 0.45, -1.25]
        },
        items: ["sambaDrum", "carnivalMask"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句巴西的问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["olaSign"]
      }
    ],
    environment: [
      { type: "plane", zone: "rainforest", position: [-2.1, 0.01, 0.25], rotation: [-1.5708, 0, -0.35], size: [1.45, 0.38], color: "#7ed9ff", roughness: 0.25 },
      { type: "plane", zone: "football", position: [1.6, 0.012, 0.8], rotation: [-1.5708, 0, 0], size: [1.65, 1.0], color: "#82d36b", roughness: 0.8 },
      { type: "box", zone: "music", position: [1.55, 0.08, -1.25], size: [1.55, 0.16, 0.9], color: "#f2c96d", roughness: 0.65 },
      { type: "box", zone: "language", position: [0, 0.08, -1.7], size: [1.45, 0.16, 0.75], color: "#fff1a8", roughness: 0.72 },
      { type: "cylinder", zone: "language", position: [-0.55, 0.32, -1.7], args: [0.035, 0.035, 0.62, 10], color: "#a66c3f" },
      { type: "cylinder", zone: "language", position: [0.55, 0.32, -1.7], args: [0.035, 0.035, 0.62, 10], color: "#a66c3f" },
      { type: "tree", zone: "rainforest", position: [-2.65, 0, -1.0], color: "#37b96d" },
      { type: "tree", zone: "rainforest", position: [-2.7, 0, -0.35], color: "#7ed957" },
      { type: "tree", zone: "rainforest", position: [-1.65, 0, -1.25], color: "#8bd66b" }
    ],
    items: [
      {
        id: "rainforest",
        name: "雨林",
        fallbackType: "rainforest",
        model: null,
        position: [-2.0, 0, -0.65],
        scale: 1,
        labelOffset: [0, 1.45, 0],
        intro: "巴西有大片热带雨林，那里有很多植物和动物。"
      },
      {
        id: "parrot",
        name: "鹦鹉",
        fallbackType: "parrot",
        model: null,
        position: [-1.25, 0.8, -0.25],
        scale: 0.75,
        labelOffset: [0, 0.85, 0],
        intro: "热带雨林里生活着颜色鲜艳的鸟。"
      },
      {
        id: "river",
        name: "河流",
        fallbackType: "river",
        model: null,
        position: [-2.3, 0.02, 0.35],
        scale: 1,
        labelOffset: [0, 0.45, 0],
        intro: "巴西有很长很宽的河流。"
      },
      {
        id: "football",
        name: "足球",
        fallbackType: "football",
        model: null,
        position: [1.35, 0.12, 0.8],
        scale: 0.85,
        labelOffset: [0, 0.85, 0],
        intro: "足球在巴西非常受欢迎。"
      },
      {
        id: "goal",
        name: "球门",
        fallbackType: "goal",
        model: null,
        position: [2.25, 0, 0.8],
        scale: 0.8,
        labelOffset: [0, 1.15, 0],
        intro: "足球要踢进球门才算进球。"
      },
      {
        id: "sambaDrum",
        name: "桑巴鼓",
        fallbackType: "sambaDrum",
        model: null,
        position: [1.2, 0.18, -1.25],
        scale: 0.9,
        labelOffset: [0, 0.95, 0],
        intro: "桑巴音乐有很热闹的鼓点。"
      },
      {
        id: "carnivalMask",
        name: "狂欢节面具",
        fallbackType: "carnivalMask",
        model: null,
        position: [2.05, 0.18, -1.15],
        scale: 0.8,
        labelOffset: [0, 0.95, 0],
        intro: "巴西狂欢节有鲜艳的服装和面具。"
      },
      {
        id: "olaSign",
        name: "Olá",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.7],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "Olá 是葡萄牙语里的你好。"
      }
    ]
  },

  france: {
    id: "france",
    name: "法国",
    greeting: "Bonjour",
    language: "法语",
    greetingIntro: "法语里的“你好”是 Bonjour",
    starsTotal: 7,
    theme: {
      sky: "#bfe3ff",
      ground: "#edf0f2",
      accent: "#72c6df",
      panelAccent: "#eef3ff"
    },
    views: {
      overview: {
        position: [4.4, 3.0, 6.2],
        target: [0, 0.6, 0]
      }
    },
    zones: [
      {
        id: "landmark",
        name: "地标区",
        hint: "看看法国的著名建筑",
        camera: {
          position: [-2.9, 2.2, 3.8],
          target: [-1.6, 0.65, -0.65]
        },
        items: ["eiffelTower", "castle"]
      },
      {
        id: "bakery",
        name: "面包店",
        hint: "找找法国常见的面包",
        camera: {
          position: [-2.5, 2.0, 3.4],
          target: [-1.35, 0.55, 0.85]
        },
        items: ["bakery", "baguette"]
      },
      {
        id: "art",
        name: "画画角落",
        hint: "法国也有很多艺术",
        camera: {
          position: [2.5, 2.0, 3.4],
          target: [1.35, 0.55, 0.75]
        },
        items: ["painting", "beret"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句法国的问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["bonjourSign"]
      }
    ],
    environment: [
      { type: "circle", zone: "landmark", position: [-1.65, 0.012, -0.78], rotation: [-1.5708, 0, 0], radius: 1.25, color: "#dfe5e8", roughness: 0.9 },
      { type: "box", zone: "bakery", position: [-1.45, 0.08, 0.9], size: [1.15, 0.16, 0.75], color: "#f2d39b", roughness: 0.7 },
      { type: "box", zone: "art", position: [1.35, 0.08, 0.8], size: [1.05, 0.16, 0.75], color: "#cce9f2", roughness: 0.7 },
      { type: "box", zone: "language", position: [0, 0.08, -1.65], size: [1.4, 0.16, 0.72], color: "#eef3ff", roughness: 0.72 },
      { type: "cylinder", zone: "language", position: [-0.52, 0.32, -1.65], args: [0.035, 0.035, 0.62, 10], color: "#8fa0bf" },
      { type: "cylinder", zone: "language", position: [0.52, 0.32, -1.65], args: [0.035, 0.035, 0.62, 10], color: "#8fa0bf" },
      { type: "tree", zone: "art", position: [2.7, 0, 0.2], color: "#93d36d" },
      { type: "tree", zone: "bakery", position: [-2.65, 0, 0.25], color: "#93d36d" }
    ],
    items: [
      {
        id: "eiffelTower",
        name: "埃菲尔铁塔",
        fallbackType: "eiffelTower",
        model: null,
        position: [-2.1, 0, -0.8],
        scale: 1,
        labelOffset: [0, 1.65, 0],
        intro: "埃菲尔铁塔是法国巴黎的著名地标。"
      },
      {
        id: "castle",
        name: "城堡",
        fallbackType: "castle",
        model: null,
        position: [-1.15, 0, -0.95],
        scale: 0.85,
        labelOffset: [0, 1.25, 0],
        intro: "法国有很多古老又漂亮的城堡。"
      },
      {
        id: "bakery",
        name: "面包店",
        fallbackType: "bakery",
        model: null,
        position: [-1.55, 0, 0.85],
        scale: 0.9,
        labelOffset: [0, 1.1, 0],
        intro: "法国街上常能看到面包店。"
      },
      {
        id: "baguette",
        name: "法棍",
        fallbackType: "baguette",
        model: null,
        position: [-0.75, 0.14, 0.95],
        scale: 0.75,
        labelOffset: [0, 0.75, 0],
        intro: "法棍是一种长长的法国面包。"
      },
      {
        id: "painting",
        name: "画画",
        fallbackType: "painting",
        model: null,
        position: [1.2, 0, 0.75],
        scale: 0.95,
        labelOffset: [0, 1.1, 0],
        intro: "法国有许多美术馆和艺术作品。"
      },
      {
        id: "beret",
        name: "贝雷帽",
        fallbackType: "beret",
        model: null,
        position: [2.1, 0.16, 0.7],
        scale: 0.75,
        labelOffset: [0, 0.8, 0],
        intro: "贝雷帽常被用来表现法国风格。"
      },
      {
        id: "bonjourSign",
        name: "Bonjour",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.65],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "Bonjour 是法语里的你好。"
      }
    ]
  }
};

Object.assign(COUNTRIES, {
  china: {
    id: "china",
    name: "中国",
    greeting: "你好",
    language: "中文",
    greetingIntro: "中文里的问候语是你好",
    starsTotal: 5,
    theme: {
      sky: "#bfe3ff",
      ground: "#e9f7df",
      accent: "#ff7d66",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.3, 3.0, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "landmark",
        name: "地标区",
        hint: "看看中国的代表建筑和节日物件",
        camera: {
          position: [-2.8, 2.1, 3.7],
          target: [-1.45, 0.65, -0.55]
        },
        items: ["greatWall", "lantern"]
      },
      {
        id: "animal",
        name: "动物区",
        hint: "找到黑白相间的大熊猫",
        camera: {
          position: [2.4, 2.0, 3.4],
          target: [1.3, 0.55, 0.7]
        },
        items: ["panda"]
      },
      {
        id: "food",
        name: "美食区",
        hint: "看看中国常见的家常美食",
        camera: {
          position: [-2.5, 1.9, 3.3],
          target: [-1.1, 0.45, 0.9]
        },
        items: ["dumpling"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句中文问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["nihaoSign"]
      }
    ],
    environment: [
      { type: "box", zone: "landmark", position: [-1.55, 0.06, -0.62], size: [1.85, 0.12, 0.92], color: "#f2d7aa", roughness: 0.82 },
      { type: "box", zone: "animal", position: [1.35, 0.05, 0.75], size: [1.55, 0.1, 0.95], color: "#dff5d1", roughness: 0.8 },
      { type: "box", zone: "food", position: [-1.05, 0.07, 0.95], size: [1.3, 0.14, 0.78], color: "#fff1c8", roughness: 0.75 },
      { type: "box", zone: "language", position: [0, 0.08, -1.65], size: [1.35, 0.16, 0.72], color: "#fff3a6", roughness: 0.72 },
      { type: "tree", zone: "animal", position: [2.25, 0, 0.45], color: "#76c957" },
      { type: "tree", zone: "food", position: [-2.05, 0, 0.55], color: "#8bd66b" }
    ],
    items: [
      {
        id: "greatWall",
        name: "长城",
        fallbackType: "greatWall",
        model: null,
        position: [-1.85, 0, -0.65],
        scale: 0.92,
        labelOffset: [0, 1.0, 0],
        intro: "我是长城，我像一条长长的城墙，伸向远方。"
      },
      {
        id: "lantern",
        name: "红灯笼",
        fallbackType: "lantern",
        model: null,
        position: [-0.8, 0.05, -0.55],
        scale: 0.82,
        labelOffset: [0, 1.05, 0],
        intro: "我是红灯笼，过节时常常会被挂起来。"
      },
      {
        id: "panda",
        name: "大熊猫",
        fallbackType: "panda",
        model: null,
        position: [1.35, 0.05, 0.72],
        scale: 0.85,
        labelOffset: [0, 1.05, 0],
        intro: "我是大熊猫，黑白相间，喜欢吃竹子。"
      },
      {
        id: "dumpling",
        name: "饺子",
        fallbackType: "dumpling",
        model: null,
        position: [-1.08, 0.12, 0.92],
        scale: 0.82,
        labelOffset: [0, 0.8, 0],
        intro: "我是饺子，是中国很多家庭喜欢吃的食物。"
      },
      {
        id: "nihaoSign",
        name: "你好",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.65],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "你好，是中文里很常用的问候语。"
      }
    ]
  },

  japan: {
    id: "japan",
    name: "日本",
    greeting: "こんにちは",
    language: "日语",
    greetingIntro: "日语里的“你好”是 こんにちは",
    starsTotal: 5,
    theme: {
      sky: "#bfe3ff",
      ground: "#f2f7f3",
      accent: "#ff9fb2",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.3, 3.0, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "landmark",
        name: "地标区",
        hint: "看看日本的山和红色鸟居",
        camera: {
          position: [-2.7, 2.1, 3.6],
          target: [-1.45, 0.65, -0.55]
        },
        items: ["mountFuji", "toriiGate"]
      },
      {
        id: "food",
        name: "美食区",
        hint: "找到小小的寿司",
        camera: {
          position: [2.4, 1.9, 3.2],
          target: [1.25, 0.45, 0.75]
        },
        items: ["sushi"]
      },
      {
        id: "train",
        name: "交通区",
        hint: "看看跑得很快的新干线",
        camera: {
          position: [2.5, 1.9, 2.9],
          target: [1.35, 0.45, -1.05]
        },
        items: ["shinkansen"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句日语问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["konnichiwaSign"]
      }
    ],
    environment: [
      { type: "circle", zone: "landmark", position: [-1.55, 0.012, -0.62], rotation: [-1.5708, 0, 0], radius: 1.25, color: "#edf0f2", roughness: 0.9 },
      { type: "box", zone: "food", position: [1.25, 0.08, 0.78], size: [1.25, 0.16, 0.75], color: "#fff4dc", roughness: 0.72 },
      { type: "box", zone: "train", position: [1.35, 0.04, -1.05], size: [1.85, 0.08, 0.5], color: "#d7e7f4", roughness: 0.7 },
      { type: "box", zone: "language", position: [0, 0.08, -1.65], size: [1.45, 0.16, 0.72], color: "#ffe6ed", roughness: 0.72 },
      { type: "tree", zone: "landmark", position: [-2.65, 0, -0.2], color: "#ffb7c5" }
    ],
    items: [
      {
        id: "mountFuji",
        name: "富士山",
        fallbackType: "mountFuji",
        model: null,
        position: [-1.95, 0, -0.7],
        scale: 0.95,
        labelOffset: [0, 1.05, 0],
        intro: "我是富士山，是日本很有名的山。"
      },
      {
        id: "toriiGate",
        name: "鸟居",
        fallbackType: "toriiGate",
        model: null,
        position: [-0.95, 0, -0.58],
        scale: 0.82,
        labelOffset: [0, 1.1, 0],
        intro: "我是红色鸟居，在日本常能看到。"
      },
      {
        id: "sushi",
        name: "寿司",
        fallbackType: "sushi",
        model: null,
        position: [1.25, 0.12, 0.78],
        scale: 0.82,
        labelOffset: [0, 0.78, 0],
        intro: "我是寿司，是日本常见的食物。"
      },
      {
        id: "shinkansen",
        name: "新干线",
        fallbackType: "bulletTrain",
        model: null,
        position: [1.35, 0.08, -1.05],
        scale: 0.9,
        labelOffset: [0, 0.75, 0],
        intro: "我是新干线，是跑得很快的列车。"
      },
      {
        id: "konnichiwaSign",
        name: "こんにちは",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.65],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "こんにちは，是日语里的你好。"
      }
    ]
  },

  australia: {
    id: "australia",
    name: "澳大利亚",
    greeting: "Hello",
    language: "英语",
    greetingIntro: "澳大利亚也常用英语说 Hello",
    starsTotal: 5,
    theme: {
      sky: "#bfe3ff",
      ground: "#f1f8e7",
      accent: "#7ed957",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.3, 3.0, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "city",
        name: "城市区",
        hint: "看看悉尼歌剧院",
        camera: {
          position: [-2.7, 2.0, 3.5],
          target: [-1.45, 0.55, -0.6]
        },
        items: ["operaHouse"]
      },
      {
        id: "animal",
        name: "动物区",
        hint: "找到澳大利亚的可爱动物",
        camera: {
          position: [2.5, 2.0, 3.4],
          target: [1.35, 0.55, 0.7]
        },
        items: ["kangaroo", "koala"]
      },
      {
        id: "coast",
        name: "海边区",
        hint: "看看蓝色的海浪",
        camera: {
          position: [-2.4, 1.9, 3.2],
          target: [-1.15, 0.45, 0.95]
        },
        items: ["oceanWave"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句英语问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["australiaHello"]
      }
    ],
    environment: [
      { type: "box", zone: "city", position: [-1.45, 0.07, -0.6], size: [1.45, 0.14, 0.85], color: "#e5f0f4", roughness: 0.75 },
      { type: "box", zone: "animal", position: [1.35, 0.05, 0.75], size: [1.7, 0.1, 0.95], color: "#dff5d1", roughness: 0.82 },
      { type: "plane", zone: "coast", position: [-1.2, 0.012, 0.95], rotation: [-1.5708, 0, -0.18], size: [1.75, 0.58], color: "#7ed9ff", roughness: 0.35 },
      { type: "box", zone: "language", position: [0, 0.08, -1.65], size: [1.4, 0.16, 0.72], color: "#fff3a6", roughness: 0.72 },
      { type: "tree", zone: "animal", position: [2.4, 0, 0.38], color: "#93d36d" }
    ],
    items: [
      {
        id: "operaHouse",
        name: "悉尼歌剧院",
        fallbackType: "operaHouse",
        model: null,
        position: [-1.45, 0, -0.6],
        scale: 0.9,
        labelOffset: [0, 1.0, 0],
        intro: "我是悉尼歌剧院，屋顶像一片片白色的帆。"
      },
      {
        id: "kangaroo",
        name: "袋鼠",
        fallbackType: "kangaroo",
        model: null,
        position: [1.05, 0, 0.75],
        scale: 0.85,
        labelOffset: [0, 1.05, 0],
        intro: "我是袋鼠，后腿很有力，会跳得很远。"
      },
      {
        id: "koala",
        name: "考拉",
        fallbackType: "koala",
        model: null,
        position: [1.9, 0.02, 0.62],
        scale: 0.78,
        labelOffset: [0, 0.95, 0],
        intro: "我是考拉，喜欢抱着树休息。"
      },
      {
        id: "oceanWave",
        name: "海浪",
        fallbackType: "river",
        model: null,
        position: [-1.2, 0.02, 0.95],
        scale: 0.9,
        labelOffset: [0, 0.55, 0],
        intro: "澳大利亚有很长的海岸线，能看到蓝色海浪。"
      },
      {
        id: "australiaHello",
        name: "Hello",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.65],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "Hello 是英语里的你好。"
      }
    ]
  },

  egypt: {
    id: "egypt",
    name: "埃及",
    greeting: "Ahlan",
    language: "阿拉伯语",
    greetingIntro: "阿拉伯语里的问候可以说 Ahlan",
    starsTotal: 5,
    theme: {
      sky: "#bfe3ff",
      ground: "#f7e6b9",
      accent: "#ffc857",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.3, 3.0, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "desert",
        name: "沙漠区",
        hint: "看看金字塔和骆驼",
        camera: {
          position: [-2.8, 2.0, 3.6],
          target: [-1.45, 0.6, -0.55]
        },
        items: ["pyramid", "camel"]
      },
      {
        id: "river",
        name: "尼罗河",
        hint: "找到埃及重要的河流",
        camera: {
          position: [2.4, 1.9, 3.3],
          target: [1.25, 0.42, 0.75]
        },
        items: ["nileRiver", "sunBoat"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句埃及的问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["ahlanSign"]
      }
    ],
    environment: [
      { type: "circle", zone: "desert", position: [-1.45, 0.012, -0.6], rotation: [-1.5708, 0, 0], radius: 1.35, color: "#f4d999", roughness: 0.9 },
      { type: "plane", zone: "river", position: [1.25, 0.012, 0.75], rotation: [-1.5708, 0, -0.32], size: [1.75, 0.46], color: "#73d7ff", roughness: 0.35 },
      { type: "box", zone: "language", position: [0, 0.08, -1.65], size: [1.4, 0.16, 0.72], color: "#fff0c2", roughness: 0.72 }
    ],
    items: [
      {
        id: "pyramid",
        name: "金字塔",
        fallbackType: "pyramid",
        model: null,
        position: [-1.9, 0, -0.65],
        scale: 1,
        labelOffset: [0, 1.0, 0],
        intro: "我是金字塔，是埃及非常有名的古老建筑。"
      },
      {
        id: "camel",
        name: "骆驼",
        fallbackType: "camel",
        model: null,
        position: [-0.88, 0, -0.52],
        scale: 0.82,
        labelOffset: [0, 1.0, 0],
        intro: "我是骆驼，能在沙漠里走很远。"
      },
      {
        id: "nileRiver",
        name: "尼罗河",
        fallbackType: "river",
        model: null,
        position: [1.05, 0.02, 0.75],
        scale: 0.9,
        labelOffset: [0, 0.55, 0],
        intro: "尼罗河是埃及非常重要的河流。"
      },
      {
        id: "sunBoat",
        name: "小船",
        fallbackType: "boat",
        model: null,
        position: [1.75, 0.04, 0.62],
        scale: 0.78,
        labelOffset: [0, 0.75, 0],
        intro: "我是小船，可以在河面上慢慢前进。"
      },
      {
        id: "ahlanSign",
        name: "Ahlan",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.65],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "Ahlan 可以表示你好。"
      }
    ]
  },

  kenya: {
    id: "kenya",
    name: "肯尼亚",
    greeting: "Jambo",
    language: "斯瓦希里语",
    greetingIntro: "斯瓦希里语里的“你好”是 Jambo",
    starsTotal: 5,
    theme: {
      sky: "#bfe3ff",
      ground: "#eaf4d4",
      accent: "#8bd66b",
      panelAccent: "#fff3a6"
    },
    views: {
      overview: {
        position: [4.3, 3.0, 6.2],
        target: [0, 0.55, 0]
      }
    },
    zones: [
      {
        id: "savanna",
        name: "草原区",
        hint: "看看开阔草原和动物",
        camera: {
          position: [-2.7, 2.0, 3.6],
          target: [-1.35, 0.55, -0.55]
        },
        items: ["savannaTree", "lion", "giraffe"]
      },
      {
        id: "safari",
        name: "旅行区",
        hint: "找到草原上的越野车",
        camera: {
          position: [2.5, 1.9, 3.2],
          target: [1.25, 0.45, 0.78]
        },
        items: ["safariJeep"]
      },
      {
        id: "language",
        name: "语言区",
        hint: "学一句肯尼亚的问候语",
        camera: {
          position: [0.2, 2.0, 2.6],
          target: [0, 0.55, -1.55]
        },
        items: ["jamboSign"]
      }
    ],
    environment: [
      { type: "circle", zone: "savanna", position: [-1.35, 0.012, -0.55], rotation: [-1.5708, 0, 0], radius: 1.42, color: "#dfee9e", roughness: 0.88 },
      { type: "box", zone: "safari", position: [1.25, 0.05, 0.78], size: [1.65, 0.1, 0.78], color: "#efd982", roughness: 0.78 },
      { type: "box", zone: "language", position: [0, 0.08, -1.65], size: [1.4, 0.16, 0.72], color: "#fff3a6", roughness: 0.72 },
      { type: "tree", zone: "savanna", position: [-2.45, 0, -0.9], color: "#90c75a" },
      { type: "tree", zone: "savanna", position: [-0.45, 0, -0.2], color: "#99c967" }
    ],
    items: [
      {
        id: "savannaTree",
        name: "草原树",
        fallbackType: "savanna",
        model: null,
        position: [-2.05, 0, -0.62],
        scale: 0.9,
        labelOffset: [0, 1.1, 0],
        intro: "我是草原上的树，周围有开阔的草地。"
      },
      {
        id: "lion",
        name: "狮子",
        fallbackType: "lion",
        model: null,
        position: [-1.25, 0.02, -0.48],
        scale: 0.82,
        labelOffset: [0, 0.95, 0],
        intro: "我是狮子，是草原上的大型动物。"
      },
      {
        id: "giraffe",
        name: "长颈鹿",
        fallbackType: "giraffe",
        model: null,
        position: [-0.45, 0, -0.58],
        scale: 0.82,
        labelOffset: [0, 1.55, 0],
        intro: "我是长颈鹿，脖子很长，可以吃到高处的树叶。"
      },
      {
        id: "safariJeep",
        name: "越野车",
        fallbackType: "safariJeep",
        model: null,
        position: [1.25, 0.05, 0.78],
        scale: 0.86,
        labelOffset: [0, 0.82, 0],
        intro: "我是越野车，可以在草原上旅行观察动物。"
      },
      {
        id: "jamboSign",
        name: "Jambo",
        fallbackType: "welcomeSign",
        model: null,
        position: [0, 0.08, -1.65],
        scale: 1,
        labelOffset: [0, 0.9, 0],
        intro: "Jambo 是斯瓦希里语里的你好。"
      }
    ]
  }
});

export function getCountry(countryId) {
  return COUNTRIES[countryId];
}

export function getCountryItems(country) {
  return country.items;
}

export function getZone(country, zoneId) {
  return country.zones.find((zone) => zone.id === zoneId) || country.zones[0];
}

export const MVP_COUNTRY_IDS = GLOBE_MARKERS.map((marker) => marker.id);

export const MVP_COUNTRIES = Object.fromEntries(
  MVP_COUNTRY_IDS.map((countryId) => [countryId, COUNTRIES[countryId]])
);

export const MODEL_PATHS = Array.from(
  new Set(
    Object.values(MVP_COUNTRIES)
      .flatMap((country) => country.items)
      .map((item) => item.model)
      .filter(Boolean)
  )
);
