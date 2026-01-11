# Ski Simulator - Learn to Snowplough

A Three.js skiing simulation that teaches beginners how to snowplough (pizza/wedge technique) using realistic body mechanics mapped to gamepad controls.

**[Live Demo](https://ski-simulator.vercel.app)**

## Features

- **Realistic Physics**: Snowplough mechanics that respond to knee bend, toe pressure, and body lean
- **Gamepad Support**: Full PS4/PS5/Xbox controller support with intuitive mapping
- **Keyboard Fallback**: Play without a controller using keyboard controls
- **Visual Feedback**: Real-time HUD showing speed, technique quality, and ski position
- **Tutorial System**: Step-by-step introduction to snowplough technique
- **3D Graphics**: Low-poly stylized skier on a procedurally generated green slope

## Controls

### Gamepad (Recommended)

| Button | Control | Effect |
|--------|---------|--------|
| L1 (LB) | Left knee bend | Left ski edge angle |
| L2 (LT) | Left toe pressure | Left forward weight |
| Left Stick | Left shoulder lean | Weight shift |
| R1 (RB) | Right knee bend | Right ski edge angle |
| R2 (RT) | Right toe pressure | Right forward weight |
| Right Stick | Right shoulder lean | Weight shift |
| L1 + R1 | Both knees | Widen snowplough |
| L2 + R2 | Both toes | Increase braking |

### Keyboard

| Key | Control |
|-----|---------|
| Q / A | Left knee press / release |
| W / S | Left toe press / release |
| E / D | Left shoulder lean left / right |
| P / ; | Right knee press / release |
| O / L | Right toe press / release |
| I / K | Right shoulder lean left / right |

## How to Snowplough

1. **Make a Wedge**: Press both triggers (L2 + R2) or bumpers (L1 + R1) together to push your ski tails apart
2. **Control Speed**: The wider your wedge, the slower you'll go
3. **Turn**: Press harder on one side to turn in that direction
4. **Balance**: Keep even pressure on both skis for straight descent

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- [Three.js](https://threejs.org/) - 3D rendering
- [Vite](https://vite.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) - Controller input

## License

MIT
