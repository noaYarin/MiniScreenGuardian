import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  disabledButton: {
    opacity: 0.5,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 18,
  },

  containerTablet: {
    maxWidth: 980,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 20,
  },

  containerLargeTablet: {
    maxWidth: 1220,
    paddingHorizontal: 28,
  },

  formGrid: {
    width: "100%",
    gap: 18,
  },

  formGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
  },

  sectionCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7EEF7",
    shadowColor: "#10263F",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    gap: 18,
  },

  sectionCardHalf: {
    flex: 1,
    minWidth: 320,
  },

  sectionHeader: {
    gap: 6,
  },

  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: "#25364A",
  },

  dateFieldWrap: {
    width: "100%",
  },

  dateInput: {
    width: "100%",
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#DCE8F5",
    backgroundColor: "#F7FAFE",
    paddingHorizontal: 16,
    fontSize: 17,
    color: "#203246",
  },

  genderRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  genderChip: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#DCE7F2",
    backgroundColor: "#F9FBFE",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  genderChipSelected: {
    backgroundColor: "#EEF6FF",
    borderColor: "#2C6FD6",
  },

  genderChipPressed: {
    opacity: 0.9,
  },

  genderIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: "#91A4B8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  genderIndicatorSelected: {
    borderColor: "#2C6FD6",
  },

  genderIndicatorInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2C6FD6",
  },

  genderChipText: {
    fontSize: 16,
    color: "#34485E",
  },

  genderChipTextSelected: {
    color: "#1F5FBE",
  },

  selectedChildPreview: {
    width: "100%",
    paddingHorizontal: 6,
  },

  selectedChildPreviewText: {
    fontSize: 15,
    color: "#6A7D92",
  },

  footer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
  },

  saveButton: {
    width: "100%",
    maxWidth: 420,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#5FA9EA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#2B6CB3",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  saveButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },

  saveButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },

  dateFieldButton: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#DCE8F5",
    backgroundColor: "#F7FAFE",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  dateFieldButtonPressed: {
    opacity: 0.92,
  },

  dateFieldContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  dateFieldLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dateIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  dateIconEmoji: {
    fontSize: 18,
  },

  dateTextWrap: {
    flex: 1,
    gap: 4,
  },

  dateFieldLabel: {
    fontSize: 13,
    color: "#6F8298",
  },

  dateFieldValue: {
    fontSize: 18,
    color: "#203246",
  },

  dateFieldChangeText: {
    fontSize: 14,
    color: "#2C6FD6",
  },

  iosPickerFooter: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: 10,
  },

  iosPickerDoneButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  iosPickerDoneText: {
    fontSize: 14,
    color: "#2C6FD6",
  },
});