import { KEYBOARD } from '../core/Constants';
import type { InputState } from './InputState';
import { updateDerivedValues } from './InputState';

export class KeyboardManager {
  private keys: Set<string> = new Set();
  private active = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keys.add(e.code);
      this.active = true;
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    });
  }

  isActive(): boolean {
    return this.active && this.keys.size > 0;
  }

  update(state: InputState): void {
    // Left side controls
    // Knee: Q increases, A decreases (hold-based)
    if (this.keys.has(KEYBOARD.LEFT_KNEE_PRESS)) {
      state.leftKnee = Math.min(1, state.leftKnee + 0.05);
    } else if (this.keys.has(KEYBOARD.LEFT_KNEE_RELEASE)) {
      state.leftKnee = Math.max(0, state.leftKnee - 0.05);
    } else {
      // Gradual return to neutral
      state.leftKnee = Math.max(0, state.leftKnee - 0.02);
    }

    // Left toe: W increases, S decreases
    if (this.keys.has(KEYBOARD.LEFT_TOE_PRESS)) {
      state.leftToe = Math.min(1, state.leftToe + 0.05);
    } else if (this.keys.has(KEYBOARD.LEFT_TOE_RELEASE)) {
      state.leftToe = Math.max(0, state.leftToe - 0.05);
    } else {
      state.leftToe = Math.max(0, state.leftToe - 0.02);
    }

    // Left lean: E for left lean, D for right lean
    if (this.keys.has(KEYBOARD.LEFT_LEAN_LEFT)) {
      state.leftLeanX = Math.max(-1, state.leftLeanX - 0.1);
    } else if (this.keys.has(KEYBOARD.LEFT_LEAN_RIGHT)) {
      state.leftLeanX = Math.min(1, state.leftLeanX + 0.1);
    } else {
      // Return to center
      state.leftLeanX *= 0.9;
    }

    // Right side controls
    // Knee: P increases, ; decreases
    if (this.keys.has(KEYBOARD.RIGHT_KNEE_PRESS)) {
      state.rightKnee = Math.min(1, state.rightKnee + 0.05);
    } else if (this.keys.has(KEYBOARD.RIGHT_KNEE_RELEASE)) {
      state.rightKnee = Math.max(0, state.rightKnee - 0.05);
    } else {
      state.rightKnee = Math.max(0, state.rightKnee - 0.02);
    }

    // Right toe: O increases, L decreases
    if (this.keys.has(KEYBOARD.RIGHT_TOE_PRESS)) {
      state.rightToe = Math.min(1, state.rightToe + 0.05);
    } else if (this.keys.has(KEYBOARD.RIGHT_TOE_RELEASE)) {
      state.rightToe = Math.max(0, state.rightToe - 0.05);
    } else {
      state.rightToe = Math.max(0, state.rightToe - 0.02);
    }

    // Right lean: I for left lean, K for right lean
    if (this.keys.has(KEYBOARD.RIGHT_LEAN_LEFT)) {
      state.rightLeanX = Math.max(-1, state.rightLeanX - 0.1);
    } else if (this.keys.has(KEYBOARD.RIGHT_LEAN_RIGHT)) {
      state.rightLeanX = Math.min(1, state.rightLeanX + 0.1);
    } else {
      state.rightLeanX *= 0.9;
    }

    // Update derived values
    updateDerivedValues(state);
  }
}
