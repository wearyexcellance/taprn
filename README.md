# TAP Fitness

React Native (Expo) fitness app with a dark purple/black UI and real-time
TensorFlow.js MoCap (MoveNet) for camera-based rep counting and form checking.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android), or run `npm run ios` / `npm run android`
with a simulator. The Execution screen needs a **real device with a camera** —
TFJS pose inference over expo-camera does not run in the iOS Simulator.

> This was generated outside a runnable sandbox, so dependency versions
> (Expo SDK 51, RN 0.74) should be checked against `npx expo install --check`
> before your first build, and `npx expo doctor` run once to catch any
> native-module mismatches.

### Known dependency quirk: `@mediapipe/pose`

`@tensorflow-models/pose-detection` declares a peer dependency on
`@mediapipe/pose` using a plain semver like `0.5.0`, but Google only ever
publishes that package under timestamp-style versions (e.g.
`0.5.1675469404`) — there's no `0.5.0` on the npm registry, so a strict
install can fail trying to resolve it. This app never actually loads that
package (every detector here is created with `runtime: 'tfjs'`, not
`'mediapipe'`), so `package.json` pins it to a real published version via
`overrides` to satisfy the peer check without pulling in code you don't use.
If you still hit a resolution error, `npm install --legacy-peer-deps` is a
safe fallback.

## Architecture

- `App.js` — wraps navigation in `AuthProvider`.
- `src/navigation/` — bottom tabs (Pro / Home / Express) nested in a root
  stack that also holds Routine Detail, Execution, and Settings.
- `src/context/AuthContext.js` — auth state + history. Ships with a guest
  login and stubs for a custom REST API and Firebase Auth. This is also
  where the "NaN username" bug is fixed: `resolveDisplayName()` catches any
  falsy/NaN display name from the backend and falls back to the email
  handle or "Athlete" before it ever reaches a screen.
- `src/utils/angleMath.js` — `theta = arccos((A·B)/(|A||B|))` joint-angle
  calculation from three keypoints.
- `src/utils/repCounter.js` — per-exercise angle thresholds and an "up" /
  "down" state machine that increments reps on the down→up transition and
  flags good/bad form near the bottom of the movement.
- `src/utils/usePoseDetection.js` — standalone hook for wiring
  `@tensorflow-models/pose-detection` (MoveNet or BlazePose) to any frame
  source; also exports the 17-point skeleton edge list.
- `src/screens/ExecutionScreen.js` — the MoCap screen: `TensorCamera` from
  `tfjs-react-native` streams frames straight into MoveNet, keypoints are
  scaled to screen space, `SkeletonOverlay` draws the bones (green = good
  form, red = bad form, violet = neutral), and the rep counter renders as
  `10x4` / `down 0x0` per the spec.

## Swapping in BlazePose

`usePoseDetection({ model: 'blazepose' })` and the detector setup in
`ExecutionScreen.js` both already branch on model name — change
`SupportedModels.MoveNet` to `SupportedModels.BlazePose` there if you want
33-point tracking instead of MoveNet's 17.

## Wiring real auth

`AuthContext.loginWithApi()` is stubbed for a REST backend; a commented-out
`loginWithFirebase()` shows the Firebase Auth equivalent. Replace
`loginAsGuest()` in `HomeScreen.js` with a real login screen when you're
ready.
