// Unified input state interface for both gamepad and keyboard
export interface InputState {
  // Left side controls (0-1 range)
  leftKnee: number; // L1 - knee bend
  leftToe: number; // L2 - toe pressure
  leftLeanX: number; // Left stick X (-1 to 1)
  leftLeanY: number; // Left stick Y (-1 to 1)

  // Right side controls (0-1 range)
  rightKnee: number; // R1 - knee bend
  rightToe: number; // R2 - toe pressure
  rightLeanX: number; // Right stick X (-1 to 1)
  rightLeanY: number; // Right stick Y (-1 to 1)

  // Derived values
  combinedKnee: number; // Both knees pressed = wider wedge
  combinedToe: number; // Both toes pressed = more braking
  wedgeAmount: number; // Combined snowplough amount (0-1)
  turnDirection: number; // -1 (left) to 1 (right)
}

export function createDefaultInputState(): InputState {
  return {
    leftKnee: 0,
    leftToe: 0,
    leftLeanX: 0,
    leftLeanY: 0,
    rightKnee: 0,
    rightToe: 0,
    rightLeanX: 0,
    rightLeanY: 0,
    combinedKnee: 0,
    combinedToe: 0,
    wedgeAmount: 0,
    turnDirection: 0,
  };
}

export function updateDerivedValues(state: InputState): void {
  // Combined knee pressure (both L1 and R1)
  state.combinedKnee = Math.min(state.leftKnee, state.rightKnee);

  // Combined toe pressure (both L2 and R2)
  state.combinedToe = Math.min(state.leftToe, state.rightToe);

  // Wedge amount is the maximum of combined knee or combined toe
  // This makes the snowplough when pressing both sides together
  state.wedgeAmount = Math.max(state.combinedKnee, state.combinedToe);

  // Turn direction based on differential pressure and lean
  // Positive = turn right, Negative = turn left
  const kneeDiff = state.rightKnee - state.leftKnee;
  const toeDiff = state.rightToe - state.leftToe;
  const leanDiff = state.rightLeanX - state.leftLeanX;

  // Combine all turn inputs with different weights
  state.turnDirection = kneeDiff * 0.4 + toeDiff * 0.3 + leanDiff * 0.3;

  // Clamp turn direction to -1 to 1
  state.turnDirection = Math.max(-1, Math.min(1, state.turnDirection));
}
