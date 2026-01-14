import React from 'react';
import {Text, View} from 'react-native';

import {styles} from '../styles/styles';

export function Header({title, subtitle}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
  );
}
