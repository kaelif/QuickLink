import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/top-bar';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TopBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
});
