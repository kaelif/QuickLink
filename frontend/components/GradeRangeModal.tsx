import * as React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ClimbingType } from "../types/climber";
import type { GradeRange } from "../types/userProfile";
import { getGradesForType } from "../lib/grades";

const TYPE_LABELS: Record<ClimbingType, string> = {
  bouldering: "Bouldering",
  sport: "Sport",
  trad: "Trad",
};

interface GradeRangeModalProps {
  visible: boolean;
  climbingType: ClimbingType;
  gradeRange: GradeRange | undefined;
  onClose: () => void;
  onApply: (range: GradeRange) => void;
  onRemove?: () => void;
  removeLabel?: string;
}

export function GradeRangeModal({
  visible,
  climbingType,
  gradeRange,
  onClose,
  onApply,
  onRemove,
  removeLabel = "Remove from filter",
}: GradeRangeModalProps) {
  const grades = getGradesForType(climbingType);
  const minIdx = gradeRange ? grades.indexOf(gradeRange.min) : 0;
  const maxIdx = gradeRange ? grades.indexOf(gradeRange.max) : grades.length - 1;
  const safeMinIdx = minIdx >= 0 ? minIdx : 0;
  const safeMaxIdx = maxIdx >= 0 ? maxIdx : grades.length - 1;

  const [localMin, setLocalMin] = React.useState(safeMinIdx);
  const [localMax, setLocalMax] = React.useState(safeMaxIdx);

  React.useEffect(() => {
    if (visible) {
      setLocalMin(safeMinIdx);
      setLocalMax(safeMaxIdx);
    }
  }, [visible, safeMinIdx, safeMaxIdx]);

  const handleApply = () => {
    const actualMin = Math.min(localMin, localMax);
    const actualMax = Math.max(localMin, localMax);
    onApply({
      min: grades[actualMin],
      max: grades[actualMax],
    });
    onClose();
  };

  const label = TYPE_LABELS[climbingType];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{label} grade range</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <Text style={styles.label}>Min</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gradeScroll}
                contentContainerStyle={styles.gradeScrollContent}
              >
                {grades.map((g, i) => (
                  <Pressable
                    key={g}
                    onPress={() => setLocalMin(i)}
                    style={[
                      styles.gradeChip,
                      localMin === i && styles.gradeChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.gradeText,
                        localMin === i && styles.gradeTextSelected,
                      ]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Max</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gradeScroll}
                contentContainerStyle={styles.gradeScrollContent}
              >
                {grades.map((g, i) => (
                  <Pressable
                    key={g}
                    onPress={() => setLocalMax(i)}
                    style={[
                      styles.gradeChip,
                      localMax === i && styles.gradeChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.gradeText,
                        localMax === i && styles.gradeTextSelected,
                      ]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable onPress={handleApply} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
            {onRemove && (
              <Pressable
                onPress={() => {
                  onRemove();
                  onClose();
                }}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>{removeLabel}</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: "#666",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  gradeScroll: {
    flexGrow: 0,
  },
  gradeScrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#c0ccd1",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  gradeChipSelected: {
    backgroundColor: "#1a5f7a",
    borderColor: "#1a5f7a",
  },
  gradeText: {
    fontSize: 14,
    color: "#333",
  },
  gradeTextSelected: {
    color: "#fff",
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  applyBtn: {
    backgroundColor: "#1a5f7a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  removeBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  removeText: {
    fontSize: 15,
    color: "#c00",
  },
});
