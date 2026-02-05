import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserProfile } from "../context/UserProfileContext";
import { BACKGROUND_COLOR } from "../lib/theme";
import type { ClimbingType } from "../types/climber";
import type { Gender, UserProfile } from "../types/userProfile";

const GENDERS: { value: Gender; label: string }[] = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

const CLIMBING_OPTIONS: { value: ClimbingType; label: string }[] = [
  { value: "sport", label: "Sport" },
  { value: "bouldering", label: "Bouldering" },
  { value: "trad", label: "Trad" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, setProfile, isLoading } = useUserProfile();
  const [bio, setBio] = useState(profile.bio);
  const [photoUrls, setPhotoUrls] = useState<string[]>(profile.photoUrls);
  const [photoInput, setPhotoInput] = useState("");
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [genderOtherText, setGenderOtherText] = useState(profile.genderOtherText);
  const [climbingTypes, setClimbingTypes] = useState<ClimbingType[]>(profile.climbingTypes);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        setBio(profile.bio);
        setPhotoUrls(profile.photoUrls);
        setGender(profile.gender);
        setGenderOtherText(profile.genderOtherText);
        setClimbingTypes(profile.climbingTypes);
      }
    }, [isLoading, profile])
  );

  const save = useCallback(() => {
    const next: UserProfile = {
      bio,
      photoUrls,
      gender,
      genderOtherText,
      climbingTypes,
    };
    setProfile(next);
    router.back();
  }, [bio, photoUrls, gender, genderOtherText, climbingTypes, setProfile, router]);

  const toggleClimbing = (value: ClimbingType) => {
    setClimbingTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const addPhoto = () => {
    const url = photoInput.trim();
    if (url) {
      setPhotoUrls((prev) => [...prev, url]);
      setPhotoInput("");
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <Pressable onPress={save} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Section title="Bio">
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell potential partners about yourself and what you're looking for..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </Section>

          <Section title="Photos">
            {photoUrls.map((url, i) => (
              <View key={i} style={styles.photoRow}>
                <TextInput
                  style={[styles.input, styles.photoUrlInput]}
                  value={url}
                  onChangeText={(text) =>
                    setPhotoUrls((prev) => {
                      const next = [...prev];
                      next[i] = text;
                      return next;
                    })
                  }
                  placeholder="Photo URL"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
                <Pressable onPress={() => removePhoto(i)} style={styles.removePhotoBtn}>
                  <Text style={styles.removePhotoText}>Remove</Text>
                </Pressable>
              </View>
            ))}
            <View style={styles.addPhotoRow}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                value={photoInput}
                onChangeText={setPhotoInput}
                placeholder="Add photo URL"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <Pressable onPress={addPhoto} style={styles.addPhotoBtn}>
                <Text style={styles.addPhotoText}>Add</Text>
              </Pressable>
            </View>
          </Section>

          <Section title="Gender">
            <View style={styles.chipRow}>
              {GENDERS.map(({ value, label }) => (
                <Chip
                  key={value}
                  label={label}
                  selected={gender === value}
                  onPress={() => setGender(value)}
                />
              ))}
            </View>
            {gender === "other" && (
              <TextInput
                style={[styles.input, styles.otherInput]}
                value={genderOtherText}
                onChangeText={setGenderOtherText}
                placeholder="Describe your gender (optional)"
                placeholderTextColor="#999"
              />
            )}
          </Section>

          <Section title="Climbing type">
            <View style={styles.chipRow}>
              {CLIMBING_OPTIONS.map(({ value, label }) => (
                <Chip
                  key={value}
                  label={label}
                  selected={climbingTypes.includes(value)}
                  onPress={() => toggleClimbing(value)}
                />
              ))}
            </View>
          </Section>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BACKGROUND_COLOR,
  },
  cancelButton: {
    padding: 8,
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: "#1a5f7a",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  saveButton: {
    padding: 8,
    minWidth: 60,
    alignItems: "flex-end",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a5f7a",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
  bioInput: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
    minHeight: 100,
    textAlignVertical: "top",
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  photoUrlInput: {
    flex: 1,
  },
  removePhotoBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  removePhotoText: {
    fontSize: 14,
    color: "#c00",
  },
  addPhotoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  addPhotoBtn: {
    backgroundColor: "#1a5f7a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  otherInput: {
    marginTop: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  chipSelected: {
    backgroundColor: "#1a5f7a",
    borderColor: "#1a5f7a",
  },
  chipText: {
    fontSize: 15,
    color: "#333",
  },
  chipTextSelected: {
    color: "#fff",
  },
  bottomPad: {
    height: 24,
  },
});
