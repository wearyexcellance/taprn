import { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";

export const TensorCamera = cameraWithTensors(Camera);

// MoveNet keypoint index -> name, per the model's documented output order.
const MOVENET_KEYPOINTS = [
  "nose", "left_eye", "right_eye", "left_ear", "right_ear",
  "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
  "left_wrist", "right_wrist", "left_hip", "right_hip",
  "left_knee", "right_knee", "left_ankle", "right_ankle",
];

/**
 * usePoseDetection
 * -----------------
 * Owns TFJS readiness + the pose-detection model instance. Exposes
 * `estimatePose(tensor)` so the camera frame loop (which needs tight
 * control over when it grabs/disposes tensors) stays in the screen, while
 * model lifecycle stays here.
 *
 * modelType: "lightning" (fastest, good for reps) | "thunder" (more
 * accurate, heavier) | "blazepose" (33 keypoints incl. more torso detail).
 */
export function usePoseDetection(modelType = "lightning") {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const detectorRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        await tf.ready();
        await tf.setBackend("rn-webgl");

        let detector;
        if (modelType === "blazepose") {
          detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            { runtime: "tfjs", modelType: "full" }
          );
        } else {
          detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            {
              modelType:
                modelType === "thunder"
                  ? poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
                  : poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            }
          );
        }

        if (cancelled) {
          detector.dispose?.();
          return;
        }
        detectorRef.current = detector;
        setIsReady(true);
      } catch (e) {
        console.warn("Pose model init failed", e);
        if (!cancelled) setError(e);
      }
    }

    setup();
    return () => {
      cancelled = true;
      detectorRef.current?.dispose?.();
      detectorRef.current = null;
    };
  }, [modelType]);

  /**
   * Runs pose estimation on a single frame tensor and returns a
   * keypointsByName map normalized to { x, y, score }, plus the raw
   * keypoints array (for drawing). Caller owns tensor disposal.
   */
  const estimatePose = useCallback(async (imageTensor) => {
    if (!detectorRef.current) return null;
    const poses = await detectorRef.current.estimatePoses(imageTensor, {
      flipHorizontal: false,
    });
    if (!poses || poses.length === 0) return null;

    const keypoints = poses[0].keypoints;
    const byName = {};
    keypoints.forEach((kp, i) => {
      const name = kp.name || MOVENET_KEYPOINTS[i];
      if (name) byName[name] = kp;
    });
    return { keypoints, keypointsByName: byName };
  }, []);

  return { isReady, error, estimatePose };
}

export const SKELETON_EDGES = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];
