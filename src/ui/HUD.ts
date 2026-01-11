import type { InputState } from '../input/InputState';
import type { SkierState } from '../physics/SkiPhysics';

export class HUD {
  private container: HTMLDivElement;
  private speedDisplay: HTMLDivElement;
  private techniqueDisplay: HTMLDivElement;
  private wedgeVisualizer: HTMLDivElement;
  private controllerHint: HTMLDivElement;
  private tutorialBox: HTMLDivElement;

  private leftSkiElement: HTMLDivElement;
  private rightSkiElement: HTMLDivElement;
  private feedbackText: HTMLDivElement;

  private showingTutorial = true;
  private tutorialStep = 0;
  private tutorialMessages = [
    { title: 'Welcome!', text: 'Learn to snowplough (pizza/wedge) to control your speed.' },
    { title: 'Knee Control', text: 'Press L1/R1 (or Q/P on keyboard) to bend your knees.' },
    { title: 'Toe Pressure', text: 'Use L2/R2 (or W/O on keyboard) for toe pressure.' },
    { title: 'Snowplough', text: 'Press BOTH triggers together to make a wedge shape and slow down!' },
    { title: 'Turning', text: 'Press harder on one side to turn in that direction.' },
    { title: 'Ready!', text: 'Press any button to start skiing!' },
  ];

  constructor() {
    this.createHUD();
  }

  private createHUD(): void {
    this.container = document.createElement('div');
    this.container.id = 'hud';
    this.container.innerHTML = `
      <style>
        #hud {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          z-index: 100;
        }

        .hud-panel {
          background: rgba(0, 0, 0, 0.6);
          border-radius: 10px;
          padding: 15px;
          backdrop-filter: blur(5px);
        }

        #speed-display {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          text-align: right;
        }

        #speed-display .speed-value {
          font-size: 48px;
          font-weight: bold;
          line-height: 1;
        }

        #speed-display .speed-unit {
          font-size: 18px;
          opacity: 0.7;
        }

        #technique-display {
          position: absolute;
          bottom: 20px;
          left: 20px;
        }

        #wedge-visualizer {
          width: 120px;
          height: 150px;
          position: relative;
          margin-bottom: 10px;
        }

        .ski-viz {
          width: 8px;
          height: 70px;
          background: #666;
          position: absolute;
          bottom: 20px;
          border-radius: 4px;
          transition: transform 0.1s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .ski-viz.left {
          left: 40px;
          transform-origin: bottom center;
        }

        .ski-viz.right {
          right: 40px;
          transform-origin: bottom center;
        }

        .ski-viz.active {
          background: #4ecdc4;
        }

        #feedback-text {
          text-align: center;
          color: white;
          font-size: 14px;
          min-height: 20px;
        }

        #feedback-text.good { color: #4ecdc4; }
        #feedback-text.warning { color: #ffe66d; }
        #feedback-text.bad { color: #ff6b6b; }

        #controller-hint {
          position: absolute;
          bottom: 20px;
          right: 20px;
          color: white;
          font-size: 12px;
          opacity: 0.7;
        }

        #tutorial-box {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          max-width: 400px;
          transition: opacity 0.3s ease;
        }

        #tutorial-box.hidden {
          opacity: 0;
          pointer-events: none;
        }

        #tutorial-box h2 {
          color: #4ecdc4;
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        #tutorial-box p {
          color: white;
          margin: 0 0 15px 0;
          font-size: 16px;
          line-height: 1.5;
        }

        #tutorial-box .progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
        }

        #tutorial-box .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
        }

        #tutorial-box .progress-dot.active {
          background: #4ecdc4;
        }

        #input-indicators {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 20px;
        }

        .input-side {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .input-bar {
          width: 60px;
          height: 12px;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .input-bar-fill {
          height: 100%;
          background: #4ecdc4;
          transition: width 0.05s ease;
        }

        .input-label {
          color: rgba(255,255,255,0.6);
          font-size: 10px;
          text-transform: uppercase;
        }
      </style>

      <div id="speed-display" class="hud-panel">
        <div class="speed-value">0</div>
        <div class="speed-unit">km/h</div>
      </div>

      <div id="input-indicators" class="hud-panel">
        <div class="input-side">
          <div class="input-label">L Knee</div>
          <div class="input-bar"><div class="input-bar-fill" id="l-knee-bar"></div></div>
          <div class="input-label">L Toe</div>
          <div class="input-bar"><div class="input-bar-fill" id="l-toe-bar"></div></div>
        </div>
        <div class="input-side">
          <div class="input-label">R Knee</div>
          <div class="input-bar"><div class="input-bar-fill" id="r-knee-bar"></div></div>
          <div class="input-label">R Toe</div>
          <div class="input-bar"><div class="input-bar-fill" id="r-toe-bar"></div></div>
        </div>
      </div>

      <div id="technique-display" class="hud-panel">
        <div id="wedge-visualizer">
          <div class="ski-viz left"></div>
          <div class="ski-viz right"></div>
        </div>
        <div id="feedback-text"></div>
      </div>

      <div id="controller-hint" class="hud-panel">
        <div id="input-mode">Keyboard: Q/P knee, W/O toe</div>
      </div>

      <div id="tutorial-box" class="hud-panel">
        <h2>Welcome!</h2>
        <p>Loading...</p>
        <div class="progress"></div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Cache DOM references
    this.speedDisplay = document.querySelector('#speed-display .speed-value')!;
    this.techniqueDisplay = document.querySelector('#technique-display')!;
    this.wedgeVisualizer = document.querySelector('#wedge-visualizer')!;
    this.controllerHint = document.querySelector('#controller-hint')!;
    this.tutorialBox = document.querySelector('#tutorial-box')!;
    this.leftSkiElement = document.querySelector('.ski-viz.left')!;
    this.rightSkiElement = document.querySelector('.ski-viz.right')!;
    this.feedbackText = document.querySelector('#feedback-text')!;

    this.updateTutorial();
  }

  update(
    skierState: SkierState,
    inputState: InputState,
    techniqueQuality: string,
    useGamepad: boolean
  ): void {
    // Update speed
    const speedKmh = skierState.speed * 3.6;
    this.speedDisplay.textContent = speedKmh.toFixed(1);

    // Update input indicators
    (document.getElementById('l-knee-bar') as HTMLDivElement).style.width = `${inputState.leftKnee * 100}%`;
    (document.getElementById('l-toe-bar') as HTMLDivElement).style.width = `${inputState.leftToe * 100}%`;
    (document.getElementById('r-knee-bar') as HTMLDivElement).style.width = `${inputState.rightKnee * 100}%`;
    (document.getElementById('r-toe-bar') as HTMLDivElement).style.width = `${inputState.rightToe * 100}%`;

    // Update wedge visualizer (convert radians to degrees)
    // For proper wedge display: left ski tilts right, right ski tilts left
    const leftAngle = (skierState.leftSkiAngle * 180) / Math.PI;
    const rightAngle = (skierState.rightSkiAngle * 180) / Math.PI;

    this.leftSkiElement.style.transform = `rotate(${leftAngle}deg)`;
    this.rightSkiElement.style.transform = `rotate(${rightAngle}deg)`;

    // Highlight active skis
    this.leftSkiElement.classList.toggle('active', inputState.leftKnee > 0.3 || inputState.leftToe > 0.3);
    this.rightSkiElement.classList.toggle('active', inputState.rightKnee > 0.3 || inputState.rightToe > 0.3);

    // Update feedback text
    this.updateFeedback(techniqueQuality, inputState, skierState);

    // Update controller hint
    const inputMode = document.getElementById('input-mode')!;
    if (useGamepad) {
      inputMode.textContent = 'Gamepad: L1/R1 knee, L2/R2 toe';
    } else {
      inputMode.textContent = 'Keyboard: Q/P knee, W/O toe';
    }
  }

  private updateFeedback(quality: string, input: InputState, state: SkierState): void {
    this.feedbackText.className = '';

    if (quality === 'good') {
      this.feedbackText.textContent = 'Great snowplough! Nice control!';
      this.feedbackText.classList.add('good');
    } else if (quality === 'warning') {
      this.feedbackText.textContent = 'Going fast! Make a wedge to slow down!';
      this.feedbackText.classList.add('warning');
    } else if (input.wedgeAmount > 0.5) {
      this.feedbackText.textContent = 'Good wedge shape!';
      this.feedbackText.classList.add('good');
    } else if (state.speed < 1) {
      this.feedbackText.textContent = 'Press triggers lightly to start moving';
    } else {
      this.feedbackText.textContent = '';
    }
  }

  private updateTutorial(): void {
    if (!this.showingTutorial) {
      this.tutorialBox.classList.add('hidden');
      return;
    }

    const step = this.tutorialMessages[this.tutorialStep];
    this.tutorialBox.querySelector('h2')!.textContent = step.title;
    this.tutorialBox.querySelector('p')!.textContent = step.text;

    // Update progress dots
    const progressHtml = this.tutorialMessages
      .map((_, i) => `<div class="progress-dot ${i === this.tutorialStep ? 'active' : ''}"></div>`)
      .join('');
    this.tutorialBox.querySelector('.progress')!.innerHTML = progressHtml;
  }

  nextTutorialStep(): void {
    if (this.tutorialStep < this.tutorialMessages.length - 1) {
      this.tutorialStep++;
      this.updateTutorial();
    } else {
      this.showingTutorial = false;
      this.updateTutorial();
    }
  }

  hideTutorial(): void {
    this.showingTutorial = false;
    this.updateTutorial();
  }

  isTutorialActive(): boolean {
    return this.showingTutorial;
  }
}
