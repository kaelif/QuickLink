import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { UserProfile } from '../Models/UserProfile';
import { UserProfileService } from '../Services/UserProfileService';
import { SkillLevel, ClimbingType } from '../types';

interface EditProfileViewProps {
  deviceId: string;
  onSave: () => void;
  onCancel: () => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  deviceId,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [bio, setBio] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.Beginner);
  const [preferredTypes, setPreferredTypes] = useState<ClimbingType[]>([]);
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('Flexible');
  const [favoriteCrag, setFavoriteCrag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const service = new UserProfileService();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await service.getOrCreateProfile(deviceId);
      setName(profile.name);
      setAge(profile.age);
      setBio(profile.bio);
      setSkillLevel(profile.skillLevel);
      setPreferredTypes(profile.preferredTypes);
      setLocation(profile.location);
      setAvailability(profile.availability);
      setFavoriteCrag(profile.favoriteCrag || '');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profile';
      setErrorMessage(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const profile: UserProfile = {
        id: '', // Will be ignored by backend
        name,
        age,
        bio,
        skillLevel,
        preferredTypes: preferredTypes.length > 0 ? preferredTypes : [ClimbingType.Indoor],
        location: location || 'Unknown',
        profileImageName: 'person.circle.fill',
        availability: availability || 'Flexible',
        favoriteCrag: favoriteCrag || null,
      };

      await service.updateProfile(deviceId, profile);
      onSave();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      setErrorMessage(message);
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleClimbingType = (type: ClimbingType) => {
    setPreferredTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          <Text style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.ageContainer}>
            <Text style={styles.ageLabel}>Age: {age}</Text>
            <View style={styles.ageButtons}>
              <TouchableOpacity
                style={styles.ageButton}
                onPress={() => setAge(Math.max(18, age - 1))}
              >
                <Text style={styles.ageButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ageButton}
                onPress={() => setAge(Math.min(100, age + 1))}
              >
                <Text style={styles.ageButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Climbing Details</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Skill Level</Text>
            <View style={styles.pickerOptions}>
              {Object.values(SkillLevel).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.pickerOption,
                    skillLevel === level && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setSkillLevel(level)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      skillLevel === level && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Availability"
            value={availability}
            onChangeText={setAvailability}
          />
          <TextInput
            style={styles.input}
            placeholder="Favorite Crag (optional)"
            value={favoriteCrag}
            onChangeText={setFavoriteCrag}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Climbing Types</Text>
          {Object.values(ClimbingType).map((type) => (
            <View key={type} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{type}</Text>
              <Switch
                value={preferredTypes.includes(type)}
                onValueChange={() => toggleClimbingType(type)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ageLabel: {
    fontSize: 16,
  },
  ageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleLabel: {
    fontSize: 16,
  },
});

