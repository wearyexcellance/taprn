import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { colors, radii, spacing } from "../theme/colors";
import { type } from "../theme/typography";
import { TensorCamera, usePoseDetection } from "../hooks/usePoseDetection";
import SkeletonOverlay from "../components/SkeletonOverlay";
import PixelAvatar from "../components/PixelAvatar";
import { angleForExercise, RepCounter } from "../utils/poseMath";
import { getExerciseById } from "../utils/exerciseData";
import { useAuth } from "../context/AuthContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Tensor camera input resolution — smaller is faster on-device.
const TENSOR_WIDTH = 152;
const TENSOR_HEIGHT = 200;

export default function ExecutionScreen({ route, navigation }) {
  const { exerciseId } = route.params;
  const exercise = useMemo(() => getExerciseById(exerciseId), [exerciseId]);
  const { recordCompletedExercise } = useAuth();

  const [hasPermission, setHasPermission] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [keypointsByName, setKeypointsByName] = useState(null);
  const [liveAngle, setLiveAngle] = useState(null);
  const [formOk, setFormOk] = useState(true);
  const [repState, setRepState] = useState("up");
  const [repsSets, setRepsSets] = useState({ reps: 0, sets: 0 });
  const [startedAt] = useState(() => Date.now());

  const rafId = useRef(null);
  const { isReady, estimatePose } = usePoseDetection("lightning");

  const repCounter = useMemo(() => {
    if (!exercise) return null;
    return new RepCounter({
      downAngle: exercise.downAngle,
      upAngle: exercise.upAngle,
      goodFormMinAngle: exercise.goodFormMinAngle,
      onRep: ({ reps }) => {
        // Auto-advance to the next set once the target rep count is hit.
        if (reps >= exercise.targetReps) {
          repCounter.nextSet();
        }
      },
    });
  }, [exercise]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleCameraStream = (imageTensorStream) => {
    const loop = async () => {
      const nextTensor = imageTensorStream.next().value;
      if (nextTensor && isReady && repCounter) {
        const result = await estimatePose(nextTensor);
        if (result) {
          setKeypointsByName(result.keypointsByName);
          const angle = angleForExercise(result.keypointsByName, exercise.jointTriple);
          setLiveAngle(angle);
          setFormOk(repCounter.liveFormOk(angle));
          const snap = repCounter.update(angle);
          setRepState(snap.state);
          setRepsSets({ reps: snap.reps, sets: snap.sets });
        }
        tf.dispose(nextTensor);
      }
      rafId.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const handleComplete = async () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const durationSec = Math.round((Date.now() - startedAt) / 1000);
    await recordCompletedExercise({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: repsSets.reps,
      sets: repsSets.sets,
      durationSec,
    });
    navigation.goBack();
  };

  if (!exercise) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Exercise not found.</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Requesting camera access…</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Camera access is required to track your reps. Enable it in Settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TensorCamera
        style={StyleSheet.absoluteFill}
        type={Camera.Constants.Type.front}
        cameraTextureWidth={SCREEN_W}
        cameraTextureHeight={SCREEN_H}
        resizeWidth={TENSOR_WIDTH}
        resizeHeight={TENSOR_HEIGHT}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
        useCustomShadersToResize={false}
      />

      <SkeletonOverlay
        keypointsByName={keypointsByName}
        width={SCREEN_W}
        height={SCREEN_H}
        scaleX={SCREEN_W / TENSOR_WIDTH}
        scaleY={SCREEN_H / TENSOR_HEIGHT}
        formOk={formOk}
      />

      {/* Top controls toggle */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setControlsOpen((v) => !v)}
          style={styles.controlsToggle}
        >
          <Text style={styles.controlsToggleText}>
            {controlsOpen ? "Close Controls" : "Open Controls"}
          </Text>
        </TouchableOpacity>
      </View>

      {controlsOpen && (
        <View style={styles.controlsPanel}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.stateLabel}>
            {repState === "down" ? "down" : "up"} {repsSets.reps}x{repsSets.sets}
          </Text>
          {!isReady && <Text style={styles.loadingText}>Loading pose model…</Text>}
          {liveAngle != null && (
            <Text style={styles.angleText}>Angle: {Math.round(liveAngle)}°</Text>
          )}
          <View style={styles.avatarWrap}>
            <PixelAvatar state={repState} size={72} />
          </View>
        </View>
      )}

      {/* Bottom control bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.bottomIcon}>
          <Text style={styles.bottomIconText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.counterWrap}>
          <Text style={styles.counterText}>
            {repsSets.reps}x{repsSets.sets}
          </Text>
          <Text style={styles.counterTarget}>
            target {exercise.targetReps}x{exercise.targetSets}
          </Text>
        </View>

        <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.base },
  center: {
    flex: 1,
    backgroundColor: colors.base,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  permissionText: { ...type.body, color: colors.textMuted, textAlign: "center" },

  topBar: {
    position: "absolute",
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(29,25,41,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: { color: colors.text, fontSize: 22 },
  controlsToggle: {
    backgroundColor: "rgba(29,25,41,0.8)",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  controlsToggleText: { ...type.caption, color: colors.glow },

  controlsPanel: {
    position: "absolute",
    top: 110,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: "rgba(19,16,25,0.85)",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  exerciseName: { ...type.h3, color: colors.text },
  stateLabel: { ...type.counter, color: colors.primary, marginTop: spacing.xs },
  loadingText: { ...type.caption, color: colors.textMuted, marginTop: spacing.xs },
  angleText: { ...type.caption, color: colors.textMuted, marginTop: 2 },
  avatarWrap: { position: "absolute", right: spacing.md, top: spacing.md },

  bottomBar: {
    position: "absolute",
    bottom: 30,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bottomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomIconText: { color: colors.textMuted, fontSize: 22 },
  counterWrap: { alignItems: "center" },
  counterText: { ...type.h3, color: colors.text },
  counterTarget: { ...type.caption, color: colors.textMuted },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.formGood,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: { ...type.h3, color: colors.base },
});
