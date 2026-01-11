import * as THREE from 'three';
import { TERRAIN, COLORS, PHYSICS } from '../core/Constants';

export class Slope {
  public group: THREE.Group;
  private terrain: THREE.Mesh;
  private trees: THREE.Group;
  private markers: THREE.Group;

  private scrollOffset = 0;
  private terrainGeometry: THREE.PlaneGeometry;

  constructor() {
    this.group = new THREE.Group();
    this.trees = new THREE.Group();
    this.markers = new THREE.Group();

    this.createTerrain();
    this.createTrees();
    this.createMarkers();
    this.createSkybox();
  }

  private createTerrain(): void {
    // Create plane geometry
    this.terrainGeometry = new THREE.PlaneGeometry(
      TERRAIN.width,
      TERRAIN.length,
      TERRAIN.segmentsWidth,
      TERRAIN.segmentsLength
    );

    // Apply gentle undulations
    this.applyUndulations();

    // Rotate to be horizontal and tilted for slope
    this.terrainGeometry.rotateX(-Math.PI / 2);
    this.terrainGeometry.rotateX(-(PHYSICS.slopeAngle * Math.PI) / 180);

    // Snow material with subtle texture
    const snowMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.snow,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: false,
    });

    this.terrain = new THREE.Mesh(this.terrainGeometry, snowMaterial);
    this.terrain.receiveShadow = true;
    this.terrain.position.z = -TERRAIN.length / 2;
    this.group.add(this.terrain);

    // Add subtle grid lines for speed reference
    this.addGridLines();
  }

  private applyUndulations(): void {
    const positions = this.terrainGeometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      // Gentle undulations using multiple sine waves
      const undulation =
        Math.sin(x * TERRAIN.undulationFrequency * 2) *
          Math.sin(y * TERRAIN.undulationFrequency) *
          TERRAIN.undulationAmplitude +
        Math.sin(x * TERRAIN.undulationFrequency * 0.5) *
          Math.cos(y * TERRAIN.undulationFrequency * 0.7) *
          TERRAIN.undulationAmplitude *
          0.5;

      positions.setZ(i, undulation);
    }

    positions.needsUpdate = true;
    this.terrainGeometry.computeVertexNormals();
  }

  private addGridLines(): void {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.3,
    });

    // Horizontal lines every 10 meters
    for (let z = 0; z > -TERRAIN.length; z -= 10) {
      const points = [
        new THREE.Vector3(-TERRAIN.width / 2, 0.01, z),
        new THREE.Vector3(TERRAIN.width / 2, 0.01, z),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMaterial);
      this.group.add(line);
    }
  }

  private createTrees(): void {
    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 1, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4a3728 });

    const foliageGeo = new THREE.ConeGeometry(0.6, 1.5, 6);
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0x1a472a });

    // Place trees along the edges
    const treePositions = [
      // Left side
      ...Array.from({ length: 20 }, (_, i) => ({
        x: -TERRAIN.width / 2 - 1 - Math.random() * 2,
        z: -i * 10 - Math.random() * 5,
      })),
      // Right side
      ...Array.from({ length: 20 }, (_, i) => ({
        x: TERRAIN.width / 2 + 1 + Math.random() * 2,
        z: -i * 10 - Math.random() * 5,
      })),
    ];

    treePositions.forEach((pos) => {
      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.5;
      tree.add(trunk);

      // Multiple layers of foliage
      for (let i = 0; i < 3; i++) {
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.y = 1.2 + i * 0.4;
        foliage.scale.setScalar(1 - i * 0.2);
        tree.add(foliage);
      }

      tree.position.set(pos.x, 0, pos.z);
      tree.scale.setScalar(0.8 + Math.random() * 0.4);

      tree.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });

      this.trees.add(tree);
    });

    this.group.add(this.trees);
  }

  private createMarkers(): void {
    // Orange course markers
    const markerGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const markerMat = new THREE.MeshLambertMaterial({ color: 0xff6600 });

    // Place markers along the sides
    for (let z = -5; z > -TERRAIN.length; z -= 15) {
      // Left marker
      const leftMarker = new THREE.Mesh(markerGeo, markerMat);
      leftMarker.position.set(-TERRAIN.width / 2 + 2, 0.75, z);
      this.markers.add(leftMarker);

      // Right marker
      const rightMarker = new THREE.Mesh(markerGeo, markerMat);
      rightMarker.position.set(TERRAIN.width / 2 - 2, 0.75, z);
      this.markers.add(rightMarker);
    }

    this.group.add(this.markers);
  }

  private createSkybox(): void {
    // Simple gradient sky using a large sphere
    const skyGeo = new THREE.SphereGeometry(400, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      color: COLORS.sky,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(sky);

    // Distant mountains
    this.createMountains();
  }

  private createMountains(): void {
    const mountainMat = new THREE.MeshLambertMaterial({
      color: 0x6699aa,
      flatShading: true,
    });

    // Create several mountain peaks
    for (let i = 0; i < 8; i++) {
      const mountainGeo = new THREE.ConeGeometry(
        30 + Math.random() * 40,
        40 + Math.random() * 30,
        5 + Math.floor(Math.random() * 3)
      );

      const mountain = new THREE.Mesh(mountainGeo, mountainMat);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 150 + Math.random() * 50;

      mountain.position.set(
        Math.sin(angle) * distance,
        -10 + Math.random() * 10,
        Math.cos(angle) * distance - 100
      );

      // Snow caps
      const capGeo = new THREE.ConeGeometry(
        mountain.geometry.parameters.radius * 0.4,
        mountain.geometry.parameters.height * 0.3,
        mountain.geometry.parameters.radialSegments
      );
      const capMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = mountain.geometry.parameters.height * 0.4;
      mountain.add(cap);

      this.group.add(mountain);
    }
  }

  update(skierZ: number): void {
    // Infinite scroll: move terrain to follow skier
    // Keep skier visually centered while terrain scrolls
    this.scrollOffset = skierZ;

    // Update positions of trees and markers for infinite effect
    this.trees.children.forEach((tree) => {
      if (tree.position.z - skierZ > 20) {
        tree.position.z -= TERRAIN.length;
      }
    });

    this.markers.children.forEach((marker) => {
      if (marker.position.z - skierZ > 20) {
        marker.position.z -= 30; // Reset markers
      }
    });
  }

  getHeightAt(x: number, z: number): number {
    // Simple height sampling based on undulation formula
    const undulation =
      Math.sin(x * TERRAIN.undulationFrequency * 2) *
        Math.sin(z * TERRAIN.undulationFrequency) *
        TERRAIN.undulationAmplitude +
      Math.sin(x * TERRAIN.undulationFrequency * 0.5) *
        Math.cos(z * TERRAIN.undulationFrequency * 0.7) *
        TERRAIN.undulationAmplitude *
        0.5;

    // Account for slope angle
    const slopeHeight = -z * Math.tan((PHYSICS.slopeAngle * Math.PI) / 180);

    return undulation + slopeHeight;
  }
}
