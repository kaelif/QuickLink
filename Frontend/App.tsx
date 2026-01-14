import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MatchingView } from './src/Views/MatchingView';
import { EditProfileView } from './src/Views/EditProfileView';
import { MatchesView } from './src/Views/MatchesView';
import { ChatListView } from './src/Views/ChatListView';
import { ChatView } from './src/Views/ChatView';
import { getDeviceId } from './src/utils/deviceId';
import { UserProfileService } from './src/Services/UserProfileService';

export type RootStackParamList = {
  Main: undefined;
  EditProfile: { deviceId: string };
  Matches: { deviceId: string };
  ChatList: { deviceId: string };
  Chat: {
    deviceId: string;
    otherDeviceId: string;
    otherUserName: string;
    otherUserImage: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowEditProfile, setShouldShowEditProfile] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const id = await getDeviceId();
      setDeviceId(id);

      // Check if profile exists
      const hasCheckedProfile = await checkProfileExists(id);
      if (!hasCheckedProfile) {
        // First launch - create profile
        const service = new UserProfileService();
        try {
          await service.getOrCreateProfile(id);
        } catch (error) {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkProfileExists = async (id: string): Promise<boolean> => {
    // In a real app, you'd check AsyncStorage or similar
    // For now, we'll just try to get the profile
    try {
      const service = new UserProfileService();
      await service.getOrCreateProfile(id);
      return true;
    } catch {
      return false;
    }
  };

  if (isLoading || !deviceId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main">
          {({ navigation }) => (
            <MatchingView
              onEditProfile={() => navigation.navigate('EditProfile', { deviceId })}
              onViewMatches={() => navigation.navigate('Matches', { deviceId })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EditProfile">
          {({ route, navigation }) => (
            <EditProfileView
              deviceId={route.params.deviceId}
              onSave={() => navigation.goBack()}
              onCancel={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Matches">
          {({ route, navigation }) => (
            <MatchesView
              deviceId={route.params.deviceId}
              onOpenChat={(otherDeviceId, otherUserName, otherUserImage) =>
                navigation.navigate('Chat', {
                  deviceId: route.params.deviceId,
                  otherDeviceId,
                  otherUserName,
                  otherUserImage,
                })
              }
              onClose={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ChatList">
          {({ route, navigation }) => (
            <ChatListView
              deviceId={route.params.deviceId}
              onOpenChat={(otherDeviceId, otherUserName, otherUserImage) =>
                navigation.navigate('Chat', {
                  deviceId: route.params.deviceId,
                  otherDeviceId,
                  otherUserName,
                  otherUserImage,
                })
              }
              onClose={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {({ route, navigation }) => (
            <ChatView
              deviceId={route.params.deviceId}
              otherDeviceId={route.params.otherDeviceId}
              otherUserName={route.params.otherUserName}
              otherUserImage={route.params.otherUserImage}
              onClose={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
