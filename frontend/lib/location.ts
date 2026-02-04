import * as Location from "expo-location";

export interface UserCoords {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<UserCoords | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return null;
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}
