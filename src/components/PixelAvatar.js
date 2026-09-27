import React from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { colors } from "../theme/colors";

// A tiny 2D "pixel-art" figure with two poses (up/down), built from blocky
// <Rect> pixels rather than an imported sprite sheet, so it's fully
// self-contained. `state` mirrors the RepCounter's "up" | "down".
export default function PixelAvatar({ state = "up", size = 64 }) {
  const px = size / 16; // 16x16 grid
  const fill = colors.glow;

  const standing = [
    [7, 0], [8, 0],
    [7, 1], [8, 1],
    [6, 2], [7, 2], [8, 2], [9, 2],
    [7, 3], [8, 3],
    [7, 4], [8, 4],
    [5, 5], [10, 5],
    [7, 5], [8, 5],
    [7, 6], [8, 6],
    [6, 7], [9, 7],
    [5, 8], [10, 8],
  ];

  const crouched = [
    [7, 2], [8, 2],
    [7, 3], [8, 3],
    [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4],
    [6, 5], [9, 5],
    [6, 6], [9, 6],
    [5, 7], [10, 7],
    [4, 8], [11, 8],
  ];

  const pixels = state === "down" ? crouched : standing;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 16 16">
        {pixels.map(([x, y], i) => (
          <Rect key={i} x={x} y={y} width={1} height={1} fill={fill} />
        ))}
      </Svg>
    </View>
  );
}
