import * as THREE from 'three';
import { COLORS, SKIER } from '../core/Constants';
import type { SkierState } from '../physics/SkiPhysics';

export class SkierModel {
  public group: THREE.Group;

  // Body parts for articulation
  private torso: THREE.Mesh;
  private head: THREE.Mesh;
  private leftUpperLeg: THREE.Mesh;
  private leftLowerLeg: THREE.Mesh;
  private rightUpperLeg: THREE.Mesh;
  private rightLowerLeg: THREE.Mesh;
  private leftArm: THREE.Mesh;
  private rightArm: THREE.Mesh;
  private leftSki: THREE.Mesh;
  private rightSki: THREE.Mesh;
  private leftPole: THREE.Mesh;
  private rightPole: THREE.Mesh;

  // Joint groups for rotation
  private leftHip: THREE.Group;
  private rightHip: THREE.Group;
  private leftKnee: THREE.Group;
  private rightKnee: THREE.Group;
  private leftAnkle: THREE.Group;
  private rightAnkle: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.createModel();
  }

  private createModel(): void {
    const jacketMat = new THREE.MeshLambertMaterial({ color: COLORS.skier.jacket });
    const pantsMat = new THREE.MeshLambertMaterial({ color: COLORS.skier.pants });
    const bootsMat = new THREE.MeshLambertMaterial({ color: COLORS.skier.boots });
    const skinMat = new THREE.MeshLambertMaterial({ color: COLORS.skier.skin });
    const skiMat = new THREE.MeshLambertMaterial({ color: COLORS.skier.ski });

    // Torso (jacket)
    const torsoGeo = new THREE.BoxGeometry(0.35, 0.45, 0.2);
    this.torso = new THREE.Mesh(torsoGeo, jacketMat);
    this.torso.position.y = 1.1;
    this.group.add(this.torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 8, 6);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.5;
    this.group.add(this.head);

    // Helmet
    const helmetGeo = new THREE.SphereGeometry(0.13, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmetMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.52;
    this.group.add(helmet);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.08, 0.35, 0.08);

    this.leftArm = new THREE.Mesh(armGeo, jacketMat);
    this.leftArm.position.set(-0.25, 1.05, 0);
    this.leftArm.rotation.z = 0.3;
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, jacketMat);
    this.rightArm.position.set(0.25, 1.05, 0);
    this.rightArm.rotation.z = -0.3;
    this.group.add(this.rightArm);

    // Left leg hierarchy
    this.leftHip = new THREE.Group();
    this.leftHip.position.set(-0.1, 0.85, 0);
    this.group.add(this.leftHip);

    const upperLegGeo = new THREE.BoxGeometry(0.12, 0.35, 0.12);
    this.leftUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
    this.leftUpperLeg.position.y = -0.175;
    this.leftHip.add(this.leftUpperLeg);

    this.leftKnee = new THREE.Group();
    this.leftKnee.position.y = -0.35;
    this.leftHip.add(this.leftKnee);

    const lowerLegGeo = new THREE.BoxGeometry(0.1, 0.35, 0.1);
    this.leftLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
    this.leftLowerLeg.position.y = -0.175;
    this.leftKnee.add(this.leftLowerLeg);

    this.leftAnkle = new THREE.Group();
    this.leftAnkle.position.y = -0.35;
    this.leftKnee.add(this.leftAnkle);

    // Left boot
    const bootGeo = new THREE.BoxGeometry(0.12, 0.12, 0.2);
    const leftBoot = new THREE.Mesh(bootGeo, bootsMat);
    leftBoot.position.set(0, -0.06, 0.04);
    this.leftAnkle.add(leftBoot);

    // Left ski
    const skiGeo = new THREE.BoxGeometry(SKIER.skiWidth, 0.02, SKIER.skiLength);
    this.leftSki = new THREE.Mesh(skiGeo, skiMat);
    this.leftSki.position.set(0, -0.13, 0);
    this.leftAnkle.add(this.leftSki);

    // Right leg hierarchy (mirror of left)
    this.rightHip = new THREE.Group();
    this.rightHip.position.set(0.1, 0.85, 0);
    this.group.add(this.rightHip);

    this.rightUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
    this.rightUpperLeg.position.y = -0.175;
    this.rightHip.add(this.rightUpperLeg);

    this.rightKnee = new THREE.Group();
    this.rightKnee.position.y = -0.35;
    this.rightHip.add(this.rightKnee);

    this.rightLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
    this.rightLowerLeg.position.y = -0.175;
    this.rightKnee.add(this.rightLowerLeg);

    this.rightAnkle = new THREE.Group();
    this.rightAnkle.position.y = -0.35;
    this.rightKnee.add(this.rightAnkle);

    // Right boot
    const rightBoot = new THREE.Mesh(bootGeo, bootsMat);
    rightBoot.position.set(0, -0.06, 0.04);
    this.rightAnkle.add(rightBoot);

    // Right ski
    this.rightSki = new THREE.Mesh(skiGeo, skiMat);
    this.rightSki.position.set(0, -0.13, 0);
    this.rightAnkle.add(this.rightSki);

    // Ski poles
    const poleGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.1, 6);
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x666666 });

    this.leftPole = new THREE.Mesh(poleGeo, poleMat);
    this.leftPole.position.set(-0.35, 0.6, 0.1);
    this.leftPole.rotation.x = 0.3;
    this.leftPole.rotation.z = 0.2;
    this.group.add(this.leftPole);

    this.rightPole = new THREE.Mesh(poleGeo, poleMat);
    this.rightPole.position.set(0.35, 0.6, 0.1);
    this.rightPole.rotation.x = 0.3;
    this.rightPole.rotation.z = -0.2;
    this.group.add(this.rightPole);

    // Pole baskets
    const basketGeo = new THREE.RingGeometry(0.03, 0.05, 6);
    const basketMat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });

    const leftBasket = new THREE.Mesh(basketGeo, basketMat);
    leftBasket.position.set(-0.4, 0.1, 0.3);
    leftBasket.rotation.x = Math.PI / 2;
    this.group.add(leftBasket);

    const rightBasket = new THREE.Mesh(basketGeo, basketMat);
    rightBasket.position.set(0.4, 0.1, 0.3);
    rightBasket.rotation.x = Math.PI / 2;
    this.group.add(rightBasket);

    // Add shadows
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  update(state: SkierState): void {
    // Update body position
    this.group.position.set(state.position.x, state.position.y, state.position.z);

    // Rotate body to face direction of travel (downhill, away from camera)
    this.group.rotation.y = state.direction + Math.PI;

    // Animate knee bend
    const baseHipAngle = 0.2; // Slight forward lean
    const maxKneeBend = 0.6; // Max knee bend angle

    // Left leg articulation
    this.leftHip.rotation.x = baseHipAngle + state.leftKneeBend * 0.3;
    this.leftKnee.rotation.x = state.leftKneeBend * maxKneeBend;

    // Right leg articulation
    this.rightHip.rotation.x = baseHipAngle + state.rightKneeBend * 0.3;
    this.rightKnee.rotation.x = state.rightKneeBend * maxKneeBend;

    // Ski angles for snowplough - apply directly
    // Physics now calculates correct angles for CSS/Three.js conventions
    this.leftAnkle.rotation.y = state.leftSkiAngle;
    this.rightAnkle.rotation.y = state.rightSkiAngle;

    // Torso lean based on turn
    this.torso.rotation.z = -state.direction * 0.3;
    this.head.rotation.z = -state.direction * 0.2;

    // Arm counterbalance
    this.leftArm.rotation.z = 0.3 - state.direction * 0.2;
    this.rightArm.rotation.z = -0.3 - state.direction * 0.2;
  }
}
