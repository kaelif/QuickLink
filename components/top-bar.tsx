import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function TopBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickLink</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
