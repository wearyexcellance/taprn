# TAP Fitness

A React Native (Expo) fitness app with real-time motion-capture rep
counting and form correction, built on TensorFlow.js (MoveNet /
BlazePose).

## Stack

- Expo SDK 51, React Navigation (native-stack)
- `@tensorflow/tfjs` + `@tensorflow/tfjs-react-native` + `@tensorflow-models/pose-detection`
- `expo-camera`'s `cameraWithTensors` bridge for a live tensor stream
- `react-native-svg` for the skeleton overlay and pixel-art avatar (no
  extra native dependency for drawing)
- AsyncStorage-backed auth context (swap for Firebase / your REST API)

## Getting started

```bash
npm install
npx expo prebuild   # required once, since tfjs-react-native + expo-camera
                     # need native modules outside Expo Go
npx expo run:ios     # or: npx expo run:android
```

> **Expo Go will not work** for the Execution screen — `tfjs-react-native`'s
> GL backend and the tensor-camera bridge require a custom dev client /
> prebuilt native project. Everything else (navigation, cards, auth) will
> run in Expo Go if you want to preview the UI quickly, but wire the app
> up with `expo run:ios` / `expo run:android` (or EAS Build) before
> testing MoCap.

## Project structure

```
App.js
src/
  theme/          color + type tokens (purple/black palette)
  context/        AuthContext — normalizes user data, kills the "NaN" bug
  navigation/      stack navigator, auth-gated
  components/      TapHeader, CategoryCard, BottomTabBar, ProfileBanner,
                    SkeletonOverlay, PixelAvatar
  screens/         Login, Home, WorkoutsPro/Express, RoutineDetail,
                    Execution (camera + MoCap), Settings
  hooks/
    usePoseDetection.js   TFJS setup + MoveNet/BlazePose detector
  utils/
    poseMath.js     angle = arccos((A·B)/(|A||B|)) + rep-counting state
                    machine (hysteresis between down/up thresholds)
    exerciseData.js catalog: categories, exercises, joint triples,
                    per-exercise angle thresholds
```

## How rep counting works

Each exercise defines a `jointTriple` (e.g. hip–knee–ankle for squats)
and two angle thresholds, `downAngle` / `upAngle`. Every frame:

1. `usePoseDetection` runs the model on the current camera tensor and
   returns keypoints keyed by name (`left_knee`, `left_hip`, …).
2. `angleForExercise` computes the joint angle with the standard
   `θ = arccos((A·B)/(|A||B|))` formula.
3. `RepCounter` is a small hysteresis state machine: a rep only
   completes after the angle has crossed *down past `downAngle`* and
   then *up past `upAngle`* (not just touched a single line), which is
   what prevents camera jitter from double-counting reps.
4. Form validation tracks the minimum angle reached during the "down"
   phase; if it never got deep/controlled enough (`goodFormMinAngle`),
   the rep is flagged and the skeleton overlay renders red instead of
   green for that state.

## The "NaN" username bug

`AuthContext.normalizeUser` is the single place raw auth payloads are
converted into what the UI reads. Any missing `displayName`, `streak`,
or `weeklyProgress` field falls back to a sane default instead of
leaking `undefined`/`NaN` into the profile banner — swap the mocked
`login()` body for your real Firebase/REST call and the guarantee still
holds as long as the response passes through `normalizeUser`.

## Swapping in BlazePose

`usePoseDetection("blazepose")` switches the detector to BlazePose (33
keypoints) if you want richer torso/face tracking than MoveNet's 17.
`SKELETON_EDGES` and the exercise `jointTriple`s currently use MoveNet's
naming (`left_knee`, etc.) — BlazePose uses the same joint names for the
shared keypoints, so most exercises work unchanged, but you'll want to
extend `SKELETON_EDGES` if you want to draw BlazePose's extra points.

## Known gaps / next steps

- Camera is fixed to `front`; add a flip-camera control if needed.
- `login()` in `AuthContext` is mocked — plug in Firebase Auth or your
  REST endpoint.
- Only single-person pose estimation is wired up (MoveNet SinglePose).
- Photo URLs in `exerciseData.js` are placeholders — swap for your own
  assets before shipping.
