import * as THREE from 'three';
import { Skier } from '../entities/Skier';
import { Slope } from '../terrain/Slope';
import { FollowCamera } from '../camera/FollowCamera';
import { GamepadManager } from '../input/GamepadManager';
import { KeyboardManager } from '../input/KeyboardManager';
import { HUD } from '../ui/HUD';
import { COLORS } from './Constants';

export class Game {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private followCamera: FollowCamera;

  private skier: Skier;
  private slope: Slope;
  private hud: HUD;

  private gamepadManager: GamepadManager;
  private keyboardManager: KeyboardManager;

  private clock: THREE.Clock;
  private isRunning = false;
  private fixedTimeStep = 1 / 60; // 60 Hz physics
  private accumulator = 0;

  private tutorialAdvanced = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    this.initRenderer();
    this.initScene();
    this.initLighting();
    this.initEntities();
    this.initInput();
    this.initHUD();
    this.initEventListeners();
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.sky);
    this.scene.fog = new THREE.Fog(COLORS.sky, 50, 200);

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.followCamera = new FollowCamera(aspect);
  }

  private initLighting(): void {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    // Directional sun light
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(50, 100, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 300;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    this.scene.add(sun);

    // Hemisphere light for natural sky/ground colors
    const hemi = new THREE.HemisphereLight(0x87ceeb, 0xffffff, 0.4);
    this.scene.add(hemi);
  }

  private initEntities(): void {
    // Create slope
    this.slope = new Slope();
    this.scene.add(this.slope.group);

    // Create skier
    this.skier = new Skier();
    this.scene.add(this.skier.model.group);
  }

  private initInput(): void {
    this.gamepadManager = new GamepadManager();
    this.keyboardManager = new KeyboardManager();
  }

  private initHUD(): void {
    this.hud = new HUD();
  }

  private initEventListeners(): void {
    window.addEventListener('resize', this.onResize.bind(this));

    // Advance tutorial on any input
    window.addEventListener('keydown', () => {
      if (this.hud.isTutorialActive()) {
        this.hud.nextTutorialStep();
      }
    });

    window.addEventListener('gamepadconnected', () => {
      if (this.hud.isTutorialActive()) {
        this.hud.nextTutorialStep();
      }
    });
  }

  private onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.followCamera.resize(width / height);
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.gameLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    requestAnimationFrame(this.gameLoop.bind(this));

    const deltaTime = this.clock.getDelta();

    // Fixed timestep physics
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.updatePhysics(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }

    // Update visuals
    this.updateVisuals();

    // Render
    this.renderer.render(this.scene, this.followCamera.camera);
  }

  private updatePhysics(dt: number): void {
    // Read input from gamepad or keyboard
    const useGamepad = this.gamepadManager.isConnected();

    if (useGamepad) {
      this.gamepadManager.update(this.skier.inputState);
    } else {
      this.keyboardManager.update(this.skier.inputState);
    }

    // Update skier physics
    this.skier.update(dt);

    // Update terrain scrolling
    this.slope.update(this.skier.state.position.z);
  }

  private updateVisuals(): void {
    // Update camera
    this.followCamera.update(this.skier.state);

    // Update HUD
    const useGamepad = this.gamepadManager.isConnected();
    this.hud.update(
      this.skier.state,
      this.skier.inputState,
      this.skier.getTechniqueQuality(),
      useGamepad
    );

    // Update sun shadow camera to follow skier
    const sun = this.scene.children.find(
      (c) => c instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight;
    if (sun) {
      sun.position.x = this.skier.state.position.x + 50;
      sun.position.z = this.skier.state.position.z + 50;
      sun.target.position.copy(
        new THREE.Vector3(
          this.skier.state.position.x,
          0,
          this.skier.state.position.z
        )
      );
      sun.target.updateMatrixWorld();
    }
  }
}
