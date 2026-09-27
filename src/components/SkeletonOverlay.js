import React from "react";
import Svg, { Circle, Line } from "react-native-svg";
import { colors } from "../theme/colors";
import { SKELETON_EDGES } from "../hooks/usePoseDetection";

const MIN_SCORE = 0.35;

/**
 * Transparent canvas laid over the camera preview. `keypoints` are in the
 * detector's source-image coordinate space; `scaleX`/`scaleY` map that
 * space onto the rendered preview size.
 */
export default function SkeletonOverlay({
  keypointsByName,
  width,
  height,
  scaleX = 1,
  scaleY = 1,
  formOk = true,
}) {
  if (!keypointsByName) return null;

  const strokeColor = formOk ? colors.formGood : colors.formBad;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
      pointerEvents="none"
    >
      {SKELETON_EDGES.map(([fromName, toName]) => {
        const from = keypointsByName[fromName];
        const to = keypointsByName[toName];
        if (!from || !to) return null;
        if ((from.score ?? 1) < MIN_SCORE || (to.score ?? 1) < MIN_SCORE) return null;
        return (
          <Line
            key={`${fromName}-${toName}`}
            x1={from.x * scaleX}
            y1={from.y * scaleY}
            x2={to.x * scaleX}
            y2={to.y * scaleY}
            stroke={strokeColor}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.9}
          />
        );
      })}
      {Object.entries(keypointsByName).map(([name, kp]) => {
        if ((kp.score ?? 1) < MIN_SCORE) return null;
        return (
          <Circle
            key={name}
            cx={kp.x * scaleX}
            cy={kp.y * scaleY}
            r={5}
            fill={colors.glow}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
      })}
    </Svg>
  );
}
