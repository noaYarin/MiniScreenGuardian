import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.light.background,
    alignItems: "stretch",
  },

  content: {
    width: "100%",
    alignSelf: "center",
  },

  headerIconButton: {
    padding: 8,
  },

  headerIconButtonPressed: {
    opacity: 0.65,
  },

  heroCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D6E6FF",
    backgroundColor: "#F8FBFF",
    padding: 16,
  },

  heading: {
    fontSize: 24,
    lineHeight: 30,
    color: "#0F172A",
  },

  subheading: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
  },

  formCard: {
    width: "100%",
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  fieldBlock: {
    width: "100%",
  },

  label: {
    marginBottom: 8,
    fontSize: 15,
    color: "#0F172A",
  },

  input: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9E3F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
  },

  genderRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },

  genderButton: {
    minWidth: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  genderButtonActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },

  genderButtonText: {
    fontSize: 14,
    color: "#334155",
  },

  genderButtonTextActive: {
    color: "#2563EB",
  },

  saveButton: {
    width: "100%",
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: APP_COLORS.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },

  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 20,
  },

  dateFieldButton: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE3F1",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  dateFieldButtonPressed: {
    opacity: 0.9,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
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
    color: "#64748B",
  },

  dateFieldValue: {
    fontSize: 16,
    color: "#0F172A",
  },

  dateFieldChangeText: {
    fontSize: 13,
    color: "#2563EB",
  },
});