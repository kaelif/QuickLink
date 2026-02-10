import { FilterProvider } from "../context/FilterContext";
import { MatchesProvider } from "../context/MatchesContext";
import { UserProfileProvider } from "../context/UserProfileContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.flex}>
        <UserProfileProvider>
          <FilterProvider>
            <MatchesProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="chat/[id]"
                  options={{
                    animation: "slide_from_left",
                  }}
                />
              </Stack>
            </MatchesProvider>
          </FilterProvider>
        </UserProfileProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
