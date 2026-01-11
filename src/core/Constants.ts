// Physics constants for skiing simulation
export const PHYSICS = {
  gravity: 9.81,
  slopeAngle: 15, // Green slope: ~15 degrees
  maxSpeed: 8, // m/s (beginner safe)
  baseFriction: 0.05,
  wedgeFriction: 0.5, // Strong friction from snowplough - allows stopping
  turnRate: 2.0, // Degrees per second per input
  dragCoefficient: 0.02,
  maxWedgeAngle: 45, // Maximum snowplough angle in degrees
  minWedgeAngle: 5, // Minimum wedge angle
};

// Camera settings
export const CAMERA = {
  fov: 60,
  near: 0.1,
  far: 1000,
  offsetBack: 1.5, // meters behind skier
  offsetUp: 1.0, // meters above skier
  lookAheadDistance: 2, // Look ahead of skier
  smoothing: 0.1, // Lerp factor for smooth follow
};

// Terrain settings
export const TERRAIN = {
  width: 30,
  length: 200,
  segmentsWidth: 30,
  segmentsLength: 200,
  scrollSpeed: 1.0,
  undulationAmplitude: 0.3,
  undulationFrequency: 0.05,
};

// Skier settings
export const SKIER = {
  height: 1.7,
  skiLength: 1.6,
  skiWidth: 0.1,
  startPosition: { x: 0, y: 1, z: 0 },
};

// Gamepad button mappings (standard gamepad layout)
export const GAMEPAD = {
  // Buttons
  L1: 4, // Left bumper
  R1: 5, // Right bumper
  L2_BUTTON: 6, // Left trigger as button
  R2_BUTTON: 7, // Right trigger as button
  // Axes
  LEFT_STICK_X: 0,
  LEFT_STICK_Y: 1,
  RIGHT_STICK_X: 2,
  RIGHT_STICK_Y: 3,
  // Triggers as axes (some controllers)
  L2_AXIS: 4,
  R2_AXIS: 5,
  // Deadzone
  DEADZONE: 0.15,
};

// Keyboard mappings
export const KEYBOARD = {
  // Left side controls
  LEFT_KNEE_PRESS: 'KeyQ',
  LEFT_KNEE_RELEASE: 'KeyA',
  LEFT_TOE_PRESS: 'KeyW',
  LEFT_TOE_RELEASE: 'KeyS',
  LEFT_LEAN_LEFT: 'KeyE',
  LEFT_LEAN_RIGHT: 'KeyD',
  // Right side controls
  RIGHT_KNEE_PRESS: 'KeyP',
  RIGHT_KNEE_RELEASE: 'Semicolon',
  RIGHT_TOE_PRESS: 'KeyO',
  RIGHT_TOE_RELEASE: 'KeyL',
  RIGHT_LEAN_LEFT: 'KeyI',
  RIGHT_LEAN_RIGHT: 'KeyK',
};

// Colors
export const COLORS = {
  sky: 0x87ceeb,
  snow: 0xffffff, // Pure white snow
  skier: {
    jacket: 0xff4444,
    pants: 0x333366,
    boots: 0x222222,
    skin: 0xffdbac,
    ski: 0x444444,
  },
  feedback: {
    good: 0x4ecdc4,
    warning: 0xffe66d,
    bad: 0xff6b6b,
  },
};
