import { Game } from './core/Game';
import './style.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');

  if (!container) {
    console.error('Could not find #app container');
    return;
  }

  // Create and start the game
  const game = new Game(container);
  game.start();

  // Log controls info
  console.log(`
╔═══════════════════════════════════════════════════╗
║         SKI SIMULATOR - SNOWPLOUGH TRAINER        ║
╠═══════════════════════════════════════════════════╣
║  GAMEPAD CONTROLS:                                ║
║    L1/R1 - Knee bend (edge control)               ║
║    L2/R2 - Toe pressure (forward weight)          ║
║    Sticks - Shoulder lean                         ║
║    Both L1+R1 or L2+R2 - Snowplough (slow down)   ║
║                                                   ║
║  KEYBOARD CONTROLS:                               ║
║    Q/A - Left knee press/release                  ║
║    W/S - Left toe press/release                   ║
║    E/D - Left shoulder lean                       ║
║    P/; - Right knee press/release                 ║
║    O/L - Right toe press/release                  ║
║    I/K - Right shoulder lean                      ║
╚═══════════════════════════════════════════════════╝
  `);
});
