import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

// Stylized "TAP" wordmark with a violet lightning bolt standing in for the A.
export default function TapLogo({ size = 22 }) {
  const boltHeight = size * 1.3;
  const boltWidth = boltHeight * 0.62;

  return (
    <View style={styles.row}>
      <Text style={[styles.word, { fontSize: size }]}>T</Text>
      <Svg
        width={boltWidth}
        height={boltHeight}
        viewBox="0 0 40 64"
        style={{ marginHorizontal: 1 }}
      >
        <Defs>
          <LinearGradient id="bolt" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primaryBright} />
            <Stop offset="1" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>
        <Path
          d="M26 0 L4 34 H18 L12 64 L38 26 H22 Z"
          fill="url(#bolt)"
        />
      </Svg>
      <Text style={[styles.word, { fontSize: size }]}>P</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  word: {
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
