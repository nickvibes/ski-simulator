import type { InputState } from '../input/InputState';
import { createDefaultInputState } from '../input/InputState';
import type { SkierState } from '../physics/SkiPhysics';
import { SkiPhysics, createInitialSkierState } from '../physics/SkiPhysics';
import { SkierModel } from './SkierModel';

export class Skier {
  public model: SkierModel;
  public state: SkierState;
  public inputState: InputState;

  private physics: SkiPhysics;

  constructor() {
    this.model = new SkierModel();
    this.state = createInitialSkierState();
    this.inputState = createDefaultInputState();
    this.physics = new SkiPhysics();
  }

  update(deltaTime: number): void {
    // Update physics based on input
    this.physics.update(this.state, this.inputState, deltaTime);

    // Update visual model to match state
    this.model.update(this.state);
  }

  getSpeedKmh(): number {
    return this.physics.getSpeedKmh(this.state);
  }

  getTechniqueQuality(): string {
    return this.physics.getTechniqueQuality(this.state, this.inputState);
  }

  reset(): void {
    this.state = createInitialSkierState();
    this.inputState = createDefaultInputState();
  }
}
