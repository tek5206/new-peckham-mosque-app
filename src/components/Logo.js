import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Colors from '../constants/colors';

const mosqueMark = require('../../assets/branding/mosque-logo.png');
const icmgWordmark = require('../../assets/branding/icmg-logo.png');

// The mosque's own octagonal emblem — used as the primary brand mark
// throughout the app (headers, splash, about screen).
export function MosqueMark({ size = 56, ring = false, style }) {
  return (
    <View
      style={[
        styles.markWrap,
        ring && {
          width: size + 14,
          height: size + 14,
          borderRadius: (size + 14) / 2,
          borderWidth: 1.5,
          borderColor: Colors.goldLight,
        },
        style,
      ]}
    >
      <Image
        source={mosqueMark}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

// ICMG organisation wordmark — used on About / Contact for institutional credibility.
export function IcmgWordmark({ width = 150, style, tint }) {
  const height = width * (104 / 420);
  return (
    <Image
      source={icmgWordmark}
      style={[{ width, height }, tint && { tintColor: tint }, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  markWrap: { alignItems: 'center', justifyContent: 'center' },
});

export default MosqueMark;
