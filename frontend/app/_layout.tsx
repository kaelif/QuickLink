import { FilterProvider } from "../context/FilterContext";
import { UserProfileProvider } from "../context/UserProfileContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <UserProfileProvider>
        <FilterProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </FilterProvider>
      </UserProfileProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
