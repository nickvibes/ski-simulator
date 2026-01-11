import * as THREE from 'three';
import { CAMERA } from '../core/Constants';
import type { SkierState } from '../physics/SkiPhysics';

export class FollowCamera {
  public camera: THREE.PerspectiveCamera;

  private targetPosition: THREE.Vector3;
  private targetLookAt: THREE.Vector3;
  private currentPosition: THREE.Vector3;
  private currentLookAt: THREE.Vector3;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(
      CAMERA.fov,
      aspect,
      CAMERA.near,
      CAMERA.far
    );

    this.targetPosition = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3(0, CAMERA.offsetUp, CAMERA.offsetBack);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  update(skierState: SkierState): void {
    // Calculate target camera position based on skier
    const skierPos = skierState.position;
    const direction = skierState.direction;

    // Position camera behind and above skier
    // Account for skier's facing direction
    this.targetPosition.set(
      skierPos.x + Math.sin(direction) * CAMERA.offsetBack,
      skierPos.y + CAMERA.offsetUp,
      skierPos.z + Math.cos(direction) * CAMERA.offsetBack
    );

    // Look ahead of the skier (slightly below to show descent)
    this.targetLookAt.set(
      skierPos.x - Math.sin(direction) * CAMERA.lookAheadDistance,
      skierPos.y - 0.3, // Look slightly down to show slope
      skierPos.z - Math.cos(direction) * CAMERA.lookAheadDistance
    );

    // Smooth interpolation (lerp) for natural follow
    this.currentPosition.lerp(this.targetPosition, CAMERA.smoothing);
    this.currentLookAt.lerp(this.targetLookAt, CAMERA.smoothing);

    // Apply to camera
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  // Shake camera for impacts or warnings
  shake(intensity: number = 0.1): void {
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * intensity,
      (Math.random() - 0.5) * intensity,
      (Math.random() - 0.5) * intensity
    );
    this.camera.position.add(offset);
  }
}
