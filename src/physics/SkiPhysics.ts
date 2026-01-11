import { PHYSICS } from '../core/Constants';
import type { InputState } from '../input/InputState';

export interface SkierState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  speed: number;
  direction: number; // Angle in radians (0 = downhill)
  wedgeAngle: number; // Current snowplough wedge angle
  leftSkiAngle: number; // Individual ski angles for visuals
  rightSkiAngle: number;
  leftKneeBend: number; // 0-1 for animation
  rightKneeBend: number;
}

export function createInitialSkierState(): SkierState {
  return {
    position: { x: 0, y: 0.5, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    speed: 0,
    direction: 0,
    wedgeAngle: PHYSICS.minWedgeAngle,
    leftSkiAngle: 0,
    rightSkiAngle: 0,
    leftKneeBend: 0,
    rightKneeBend: 0,
  };
}

export class SkiPhysics {
  private slopeAngleRad: number;
  private gravityComponent: number;

  constructor() {
    this.slopeAngleRad = (PHYSICS.slopeAngle * Math.PI) / 180;
    this.gravityComponent = PHYSICS.gravity * Math.sin(this.slopeAngleRad);
  }

  update(state: SkierState, input: InputState, deltaTime: number): void {
    // Update knee bend for animation
    state.leftKneeBend = input.leftKnee;
    state.rightKneeBend = input.rightKnee;

    // Calculate wedge angle based on input
    const targetWedge =
      PHYSICS.minWedgeAngle +
      input.wedgeAmount * (PHYSICS.maxWedgeAngle - PHYSICS.minWedgeAngle);

    // Smooth transition to target wedge
    state.wedgeAngle += (targetWedge - state.wedgeAngle) * 0.1;

    // Calculate individual ski angles for visuals
    // In snowplough, ski TIPS come together, TAILS spread apart (pizza shape)
    const halfWedge = (state.wedgeAngle * Math.PI) / 180 / 2;
    const turnOffset = input.turnDirection * 0.1;

    // After the π rotation, skier faces -Z direction
    // Left ski: rotate so tip points inward (to skier's right) = negative angle
    // Right ski: rotate so tip points inward (to skier's left) = positive angle
    let leftAngle = -halfWedge + turnOffset;
    let rightAngle = halfWedge + turnOffset;

    // Clamp to prevent skis from crossing
    // Left ski should stay negative or near zero, right ski should stay positive or near zero
    const minAngle = (2 * Math.PI) / 180; // 2 degree minimum
    if (leftAngle > -minAngle) leftAngle = -minAngle;
    if (rightAngle < minAngle) rightAngle = minAngle;

    state.leftSkiAngle = leftAngle;
    state.rightSkiAngle = rightAngle;

    // Calculate friction based on wedge angle
    // Wider wedge = more friction = slower
    const wedgeFactor = state.wedgeAngle / PHYSICS.maxWedgeAngle;
    const totalFriction =
      PHYSICS.baseFriction + wedgeFactor * PHYSICS.wedgeFriction;

    // Calculate acceleration
    // Gravity pulls downhill, friction opposes motion
    const gravityAccel = this.gravityComponent;
    const frictionAccel = totalFriction * PHYSICS.gravity * Math.cos(this.slopeAngleRad);
    const dragAccel = PHYSICS.dragCoefficient * state.speed * state.speed;

    // Net acceleration (gravity minus friction and drag)
    let netAccel = gravityAccel - frictionAccel - dragAccel;

    // If very slow, don't go negative (no going uphill)
    if (state.speed < 0.1 && netAccel < 0) {
      netAccel = 0;
    }

    // Update speed
    state.speed += netAccel * deltaTime;
    state.speed = Math.max(0, Math.min(PHYSICS.maxSpeed, state.speed));

    // Update direction based on turn input
    // Turning is more effective at lower speeds
    const turnEffectiveness = 1 - state.speed / PHYSICS.maxSpeed * 0.5;
    const turnRate = PHYSICS.turnRate * input.turnDirection * turnEffectiveness;
    state.direction += (turnRate * Math.PI / 180) * deltaTime;

    // Clamp direction to reasonable range (don't turn more than 45 degrees from downhill)
    const maxTurnAngle = Math.PI / 4;
    state.direction = Math.max(-maxTurnAngle, Math.min(maxTurnAngle, state.direction));

    // Update velocity based on speed and direction
    // Z is downhill (negative), X is lateral
    state.velocity.z = -state.speed * Math.cos(state.direction);
    state.velocity.x = state.speed * Math.sin(state.direction);

    // Update position
    state.position.x += state.velocity.x * deltaTime;
    state.position.z += state.velocity.z * deltaTime;

    // Update Y position based on slope - skier descends as they move down slope
    // Z becomes more negative going downhill, so Y should also decrease
    // slopeHeight = z * tan(angle) -> when z is negative, height is negative (lower)
    const slopeHeight = state.position.z * Math.tan(this.slopeAngleRad);
    state.position.y = 0.5 + slopeHeight; // 0.5 base height + slope descent

    // Keep skier on the slope (simple constraint)
    // Lateral bounds
    const maxX = 10;
    if (Math.abs(state.position.x) > maxX) {
      state.position.x = Math.sign(state.position.x) * maxX;
      state.direction *= 0.5; // Reduce turn when hitting edge
    }
  }

  getSpeedKmh(state: SkierState): number {
    return state.speed * 3.6; // m/s to km/h
  }

  getTechniqueQuality(state: SkierState, input: InputState): string {
    // Evaluate technique based on input balance and wedge
    const kneeDiff = Math.abs(input.leftKnee - input.rightKnee);
    const hasWedge = input.wedgeAmount > 0.3;

    if (hasWedge && kneeDiff < 0.2 && state.speed < 5) {
      return 'good';
    } else if (hasWedge) {
      return 'okay';
    } else if (state.speed > 6) {
      return 'warning';
    }
    return 'neutral';
  }
}
