import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'deviceId';

export async function getDeviceId(): Promise<string> {
  try {
    // Try to get saved device ID
    const savedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (savedDeviceId) {
      return savedDeviceId;
    }

    // Generate a new device ID
    let deviceId: string;
    if (Device.isDevice) {
      // Use device identifier if available
      // Note: expo-device doesn't provide a unique identifier directly
      // We'll generate a UUID and store it
      deviceId = generateUUID();
    } else {
      // For simulator/emulator, generate a UUID
      deviceId = generateUUID();
    }

    // Save the device ID
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    return deviceId;
  } catch (error) {
    // Fallback to generating a new UUID
    const fallbackId = generateUUID();
    try {
      await AsyncStorage.setItem(DEVICE_ID_KEY, fallbackId);
    } catch {
      // Ignore storage errors
    }
    return fallbackId;
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

