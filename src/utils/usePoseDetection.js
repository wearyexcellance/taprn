import { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Camera } from 'expo-camera';

// Loads MoveNet (default) or BlazePose and runs it against frames pulled
// from an expo-camera <Camera> ref via a texture-reading loop.
//
// model: 'movenet-lightning' | 'movenet-thunder' | 'blazepose'
export function usePoseDetection({ model = 'movenet-lightning' } = {}) {
  const [ready, setReady] = useState(false);
  const [pose, setPose] = useState(null);
  const detectorRef = useRef(null);
  const runningRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      await tf.ready();

      let detector;
      if (model === 'blazepose') {
        detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
          runtime: 'tfjs',
          modelType: 'full',
        });
      } else {
        detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType:
            model === 'movenet-thunder'
              ? poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
              : poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        });
      }

      if (!cancelled) {
        detectorRef.current = detector;
        setReady(true);
      }
    }

    setup();
    return () => {
      cancelled = true;
      detectorRef.current?.dispose?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [model]);

  // Call this once you have a GL context / texture source per frame (e.g. from
  // expo-camera's onCameraReady + expo-gl CameraStream, or Camera.takePictureAsync
  // for lower frame rates). `getFrameTensor` should return a tf.Tensor3D (or null).
  const start = useCallback((getFrameTensor, { fps = 20 } = {}) => {
    runningRef.current = true;
    const interval = 1000 / fps;
    let lastTime = 0;

    async function loop(time) {
      if (!runningRef.current) return;
      if (time - lastTime >= interval && detectorRef.current) {
        lastTime = time;
        const tensor = getFrameTensor();
        if (tensor) {
          try {
            const poses = await detectorRef.current.estimatePoses(tensor, {
              flipHorizontal: false,
            });
            tf.dispose(tensor);
            if (poses && poses.length > 0) setPose(poses[0]);
          } catch (e) {
            tf.dispose(tensor);
            console.warn('pose estimation error', e);
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return { ready, pose, start, stop };
}

export async function requestCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
}

// MoveNet's 17-point COCO skeleton connections, used to draw bone lines.
export const SKELETON_EDGES = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];
