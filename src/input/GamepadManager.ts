import { GAMEPAD } from '../core/Constants';
import type { InputState } from './InputState';
import { updateDerivedValues } from './InputState';

export class GamepadManager {
  private gamepadIndex: number | null = null;
  private connected = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      console.log(`Gamepad connected: ${e.gamepad.id}`);
      this.gamepadIndex = e.gamepad.index;
      this.connected = true;
    });

    window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
      console.log(`Gamepad disconnected: ${e.gamepad.id}`);
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepadIndex = null;
        this.connected = false;
      }
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  update(state: InputState): void {
    if (this.gamepadIndex === null) return;

    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.gamepadIndex];

    if (!gamepad) return;

    // Read button states (L1, R1 as knee controls)
    state.leftKnee = gamepad.buttons[GAMEPAD.L1]?.value ?? 0;
    state.rightKnee = gamepad.buttons[GAMEPAD.R1]?.value ?? 0;

    // Read trigger states (L2, R2 as toe controls)
    // Some controllers report triggers as buttons, others as axes
    if (gamepad.buttons[GAMEPAD.L2_BUTTON]) {
      state.leftToe = gamepad.buttons[GAMEPAD.L2_BUTTON].value;
    }
    if (gamepad.buttons[GAMEPAD.R2_BUTTON]) {
      state.rightToe = gamepad.buttons[GAMEPAD.R2_BUTTON].value;
    }

    // Read analog stick values with deadzone
    state.leftLeanX = this.applyDeadzone(gamepad.axes[GAMEPAD.LEFT_STICK_X] ?? 0);
    state.leftLeanY = this.applyDeadzone(gamepad.axes[GAMEPAD.LEFT_STICK_Y] ?? 0);
    state.rightLeanX = this.applyDeadzone(gamepad.axes[GAMEPAD.RIGHT_STICK_X] ?? 0);
    state.rightLeanY = this.applyDeadzone(gamepad.axes[GAMEPAD.RIGHT_STICK_Y] ?? 0);

    // Update derived values
    updateDerivedValues(state);
  }

  private applyDeadzone(value: number): number {
    if (Math.abs(value) < GAMEPAD.DEADZONE) {
      return 0;
    }
    // Remap the value to start from 0 after deadzone
    const sign = Math.sign(value);
    const magnitude = (Math.abs(value) - GAMEPAD.DEADZONE) / (1 - GAMEPAD.DEADZONE);
    return sign * magnitude;
  }
}
