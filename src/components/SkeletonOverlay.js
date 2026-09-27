import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../theme/colors';
import { SKELETON_EDGES } from '../utils/usePoseDetection';

// Renders 17 (MoveNet) to 33 (BlazePose) keypoint dots and connecting bone
// lines over the camera feed. Lines turn green/red based on formStatus.
export default function SkeletonOverlay({ pose, width, height, formStatus = 'neutral' }) {
  if (!pose?.keypoints?.length) return null;

  const byName = {};
  pose.keypoints.forEach((k) => {
    byName[k.name] = k;
  });

  const boneColor =
    formStatus === 'good' ? colors.success : formStatus === 'bad' ? colors.danger : colors.primaryBright;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      {SKELETON_EDGES.map(([a, b], i) => {
        const pa = byName[a];
        const pb = byName[b];
        if (!pa || !pb || pa.score < 0.3 || pb.score < 0.3) return null;
        return (
          <Line
            key={`edge-${i}`}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={boneColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
      {pose.keypoints.map((k, i) =>
        k.score >= 0.3 ? (
          <Circle key={`kp-${i}`} cx={k.x} cy={k.y} r={5} fill={colors.text} stroke={boneColor} strokeWidth={2} />
        ) : null
      )}
    </Svg>
  );
}
