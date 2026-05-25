export const PHYSICS_TUNING = {
  dragSpring: 10,
  maxDragSpeed: 14,
  carMass: 2,
  truckMass: 6,
  ballRestitution: 0.75,
  boxFriction: 0.8,
  boxRestitution: 0.32,
  groundFriction: 0.7,
  railFriction: 0.18,
  railRestitution: 0.36,
  linearDamping: 0.4,
  angularDamping: 0.5,
  dragLift: 0.85,
  dragPlaneY: 0.45,
  dragMaxLiftY: 1.65,
  maxDragVerticalSpeed: 8,
  dragLinearDamping: 1.6,
  dragAngularDamping: 1.8,
  boundaryLimitX: 8.4,
  boundaryLimitZ: 6.4,
  boundaryLimitY: 7.2
};

export const DYNAMIC_OBJECTS = {
  car: {
    id: "car",
    label: "小车",
    position: [-3.2, 0.48, -0.9],
    rotation: [0, 0.12, 0],
    mass: PHYSICS_TUNING.carMass
  },
  truck: {
    id: "truck",
    label: "卡车",
    position: [-3.4, 0.62, 1.1],
    rotation: [0, 0.08, 0],
    mass: PHYSICS_TUNING.truckMass
  },
  ball: {
    id: "ball",
    label: "弹跳球",
    position: [2.2, 1.55, -2.7],
    rotation: [0, 0, 0],
    mass: 1
  },
  boxes: [
    { id: "box-a", position: [0.5, 0.44, -0.25], color: "#ffb86b" },
    { id: "box-b", position: [1.15, 0.44, 0.2], color: "#9bd972" },
    { id: "box-c", position: [1.75, 0.44, -0.2], color: "#73c8f2" },
    { id: "box-d", position: [1.25, 1.12, -0.18], color: "#ffd76d" },
    { id: "box-e", position: [2.25, 0.44, 0.35], color: "#ff8f8f" }
  ]
};
