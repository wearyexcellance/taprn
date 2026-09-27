import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { GLView } from 'expo-gl';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

import { colors, radii, spacing } from '../theme/colors';
import SkeletonOverlay from '../components/SkeletonOverlay';
import { createRepCounter, EXERCISES } from '../utils/repCounter';
import { useAuth } from '../context/AuthContext';

const TensorCamera = cameraWithTensors(Camera);
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Tensor size fed to the model — smaller = faster on-device inference.
const TENSOR_WIDTH = 152;
const TENSOR_HEIGHT = 200;

export default function ExecutionScreen({ route, navigation }) {
  const { exercise } = route.params; // { id, name, exerciseKey, targetReps }
  const { logCompletedExercise } = useAuth();

  const [hasPermission, setHasPermission] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [pose, setPose] = useState(null);
  const [modelReady, setModelReady] = useState(false);

  const detectorRef = useRef(null);
  const repCounterRef = useRef(createRepCounter(exercise.exerciseKey, { repsPerSet: exercise.targetReps }));
  const rafId = useRef(null);
  const [counterText, setCounterText] = useState('down 0x0');
  const [formStatus, setFormStatus] = useState('neutral');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await tf.ready();
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
      if (!cancelled) {
        detectorRef.current = detector;
        setModelReady(true);
      }
    })();
    return () => {
      cancelled = true;
      detectorRef.current?.dispose?.();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Called by TensorCamera for every frame; runs pose estimation and updates
  // the rep-counting state machine + skeleton overlay colors.
  const handleCameraStream = useCallback((imageTensorStream) => {
    const loop = async () => {
      const imageTensor = imageTensorStream.next().value;
      if (imageTensor && detectorRef.current) {
        try {
          const poses = await detectorRef.current.estimatePoses(imageTensor, { flipHorizontal: false });
          if (poses?.length) {
            const scaled = scalePoseToScreen(poses[0], TENSOR_WIDTH, TENSOR_HEIGHT, SCREEN_W, SCREEN_H);
            setPose(scaled);

            const next = repCounterRef.current.update(scaled);
            setCounterText(repCounterRef.current.getDisplayCounter());
            setFormStatus(next.formStatus);
          }
        } catch (e) {
          // swallow occasional inference errors, keep the loop alive
        }
        tf.dispose(imageTensor);
      }
      rafId.current = requestAnimationFrame(loop);
    };
    loop();
  }, []);

  const handleComplete = useCallback(async () => {
    const state = repCounterRef.current.getState();
    await logCompletedExercise({
      exerciseName: exercise.name,
      reps: state.reps,
      sets: state.sets,
      goodFormPct: state.formStatus === 'good' ? 100 : 70,
    });
    navigation.goBack();
  }, [exercise.name, logCompletedExercise, navigation]);

  if (hasPermission === null || !modelReady) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={styles.loadingText}>Loading MoCap engine…</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={styles.loadingText}>Camera access is required for MoCap tracking.</Text>
        <Pressable style={styles.permButton} onPress={() => navigation.goBack()}>
          <Text style={styles.permButtonText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const config = EXERCISES[exercise.exerciseKey];
  const avatarState = repCounterRef.current.getState().phase; // 'up' | 'down'

  return (
    <View style={styles.container}>
      <TensorCamera
        style={StyleSheet.absoluteFillObject}
        type={CameraType.front}
        cameraTextureWidth={TENSOR_WIDTH}
        cameraTextureHeight={TENSOR_HEIGHT}
        resizeWidth={TENSOR_WIDTH}
        resizeHeight={TENSOR_HEIGHT}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender
        useCustomShadersToResize={false}
      />

      <SkeletonOverlay pose={pose} width={SCREEN_W} height={SCREEN_H} formStatus={formStatus} />

      <SafeAreaView style={styles.overlayUI} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
          <Pressable style={styles.iconButton} onPress={() => setShowControls((s) => !s)}>
            <Ionicons name={showControls ? 'options' : 'options-outline'} size={20} color={colors.text} />
          </Pressable>
        </View>

        {showControls && (
          <View style={styles.controlsPanel}>
            <Text style={styles.controlsLabel}>Open Controls</Text>
            <Text style={styles.hint}>Target: {exercise.targetReps} reps/set</Text>
            <View style={[styles.formBadge, formStatus === 'good' && styles.formGood, formStatus === 'bad' && styles.formBad]}>
              <Text style={styles.formBadgeText}>
                {formStatus === 'good' ? 'Good form' : formStatus === 'bad' ? 'Fix your form' : 'Tracking…'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.pixelAvatarWrap}>
          <View style={[styles.pixelAvatar, avatarState === 'down' && styles.pixelAvatarDown]}>
            <Ionicons
              name={avatarState === 'down' ? 'body' : 'walk'}
              size={28}
              color={colors.bg}
            />
          </View>
        </View>

        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>{config?.label ?? exercise.name}</Text>
          <Text style={styles.counterValue}>{counterText}</Text>
        </View>

        <View style={styles.bottomBar}>
          <Pressable style={styles.bottomIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.bottomStats}>
            <Text style={styles.bottomStatsText}>{counterText}</Text>
          </View>
          <Pressable style={styles.completeButton} onPress={handleComplete}>
            <Ionicons name="checkmark" size={24} color={colors.bg} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// MoveNet returns keypoints in the tensor's coordinate space; map them to
// screen pixels so the overlay lines up with the visible camera feed.
function scalePoseToScreen(pose, tensorW, tensorH, screenW, screenH) {
  const scaleX = screenW / tensorW;
  const scaleY = screenH / tensorH;
  return {
    ...pose,
    keypoints: pose.keypoints.map((k) => ({ ...k, x: k.x * scaleX, y: k.y * scaleY })),
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing(6) },
  loadingText: { color: colors.textDim, textAlign: 'center' },
  permButton: {
    marginTop: spacing(4),
    backgroundColor: colors.primary,
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(3),
    borderRadius: radii.pill,
  },
  permButtonText: { color: colors.bg, fontWeight: '800' },

  overlayUI: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(4),
    paddingTop: spacing(2),
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.overlayScrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },

  controlsPanel: {
    marginHorizontal: spacing(4),
    marginTop: spacing(3),
    backgroundColor: colors.overlayScrim,
    borderRadius: radii.md,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlsLabel: { color: colors.primaryBright, fontWeight: '800', fontSize: 12 },
  hint: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  formBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
  },
  formGood: { backgroundColor: 'rgba(34,211,165,0.2)' },
  formBad: { backgroundColor: 'rgba(255,77,109,0.2)' },
  formBadgeText: { color: colors.text, fontSize: 11, fontWeight: '700' },

  pixelAvatarWrap: { alignItems: 'center' },
  pixelAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 0 }],
  },
  pixelAvatarDown: { backgroundColor: colors.accent, transform: [{ translateY: 8 }] },

  counterCard: {
    alignSelf: 'center',
    backgroundColor: colors.overlayScrim,
    borderRadius: radii.lg,
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(3),
    alignItems: 'center',
    marginBottom: spacing(3),
  },
  counterLabel: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  counterValue: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 2 },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(6),
    paddingBottom: spacing(4),
  },
  bottomIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.overlayScrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomStats: {
    backgroundColor: colors.overlayScrim,
    paddingHorizontal: spacing(5),
    paddingVertical: spacing(2),
    borderRadius: radii.pill,
  },
  bottomStatsText: { color: colors.text, fontWeight: '800' },
  completeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
