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
import { useFilter } from "../context/FilterContext";
import type { ClimbingType } from "../types/climber";
import type { GenderPreference, MatchFilter } from "../types/userProfile";

const CLIMBING_OPTIONS: { value: ClimbingType; label: string }[] = [
  { value: "sport", label: "Sport" },
  { value: "bouldering", label: "Bouldering" },
  { value: "trad", label: "Trad" },
];

const GENDER_PREF_OPTIONS: { value: GenderPreference; label: string }[] = [
  { value: "woman", label: "Women" },
  { value: "man", label: "Men" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "all", label: "Everyone" },
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

export default function FilterScreen() {
  const router = useRouter();
  const { filter, setFilter, isLoading } = useFilter();
  const [ageMin, setAgeMin] = useState(String(filter.ageMin));
  const [ageMax, setAgeMax] = useState(String(filter.ageMax));
  const [genderPreferences, setGenderPreferences] = useState<GenderPreference[]>(
    filter.genderPreferences
  );
  const [climbingTypes, setClimbingTypes] = useState<ClimbingType[]>(filter.climbingTypes);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        setAgeMin(String(filter.ageMin));
        setAgeMax(String(filter.ageMax));
        setGenderPreferences(filter.genderPreferences);
        setClimbingTypes(filter.climbingTypes);
      }
    }, [isLoading, filter])
  );

  const save = useCallback(() => {
    const min = Math.max(18, Math.min(99, parseInt(ageMin, 10) || 18));
    const max = Math.max(18, Math.min(99, parseInt(ageMax, 10) || 99));
    const next: MatchFilter = {
      ageMin: Math.min(min, max),
      ageMax: Math.max(min, max),
      genderPreferences: genderPreferences.length > 0 ? genderPreferences : ["all"],
      climbingTypes,
    };
    setFilter(next);
    router.back();
  }, [ageMin, ageMax, genderPreferences, climbingTypes, setFilter, router]);

  const toggleGenderPref = (value: GenderPreference) => {
    if (value === "all") {
      setGenderPreferences(["all"]);
      return;
    }
    setGenderPreferences((prev) => {
      const withoutAll = prev.filter((p) => p !== "all");
      const next = withoutAll.includes(value)
        ? withoutAll.filter((p) => p !== value)
        : [...withoutAll, value];
      return next.length === 0 ? ["all"] : next;
    });
  };

  const toggleClimbing = (value: ClimbingType) => {
    setClimbingTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
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
          <Text style={styles.headerTitle}>Filter</Text>
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
          <Section title="Age">
            <View style={styles.ageRow}>
              <Text style={styles.ageLabel}>Min age</Text>
              <TextInput
                style={[styles.input, styles.ageInput]}
                value={ageMin}
                onChangeText={setAgeMin}
                placeholder="18"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
              <Text style={styles.ageLabel}>Max age</Text>
              <TextInput
                style={[styles.input, styles.ageInput]}
                value={ageMax}
                onChangeText={setAgeMax}
                placeholder="99"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
          </Section>

          <Section title="Show me">
            <View style={styles.chipRow}>
              {GENDER_PREF_OPTIONS.map(({ value, label }) => (
                <Chip
                  key={value}
                  label={label}
                  selected={genderPreferences.includes(value)}
                  onPress={() => toggleGenderPref(value)}
                />
              ))}
            </View>
          </Section>

          <Section title="Climbing types">
            <Text style={styles.hint}>Match with climbers who do any of these:</Text>
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
    backgroundColor: "#7e8c91",
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
  ageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  ageLabel: {
    fontSize: 15,
    color: "#555",
  },
  ageInput: {
    width: 70,
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
    backgroundColor: "#fff",
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
  hint: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bottomPad: {
    height: 24,
  },
});
