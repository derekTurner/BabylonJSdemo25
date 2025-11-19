# Agent Instructions for BabylonJS Demo

## Build & Development Commands

From `/babylonProj` directory:
- **Dev server**: `npm run dev` (starts Vite dev server on port 5173)
- **Build**: `npm run build` (runs `tsc && vite build`)
- **Preview**: `npm run preview` (preview production build)

## Codebase Structure

**Main directory**: `/babylonProj` - Vite + TypeScript + BabylonJS project
- **src/**: Core/test scenes
- **player02/**: Character controller with physics
- **meshes01/**: Mesh shape examples
- **public/**: Static assets

**Tech Stack**: 
- BabylonJS 8.33 (3D engine)
- Havok Physics plugin
- TypeScript ~5.8, Vite 6.3+

## Code Style Guidelines

**TypeScript/Imports**:
- ESNext module syntax with node resolution
- Named exports from BabylonJS core modules
- Path quotes: double quotes for strings

**Conventions**:
- camelCase for variables/functions
- Use `let` for reassignable state (e.g., `characterOrientation`)
- Functions as declarations within scope (closures)

**Type Safety**:
- `noImplicitAny: false` (any allowed for flexibility)
- `noUnusedParameters: true` (enforce cleanup)
- `noImplicitReturns: true` (explicit returns required)
- `skipLibCheck: true` (speed optimization)

**Physics/Math**:
- Vector3 for position/velocity/gravity
- Quaternion for rotations
- State machines using string literals (`"IN_AIR"`, `"ON_GROUND"`)

**Error Handling**:
- Guard checks (e.g., `if (scene.deltaTime == undefined) return;`)
- No strict null checking; use optional chaining where needed

**Naming**:
- Descriptive function names: `createCharacterController()`, `getDesiredVelocity()`
- Prefix helpers: `get*`, `create*`
