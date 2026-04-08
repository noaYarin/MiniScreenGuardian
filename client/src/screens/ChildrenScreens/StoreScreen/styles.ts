// client/src/screens/ChildrenScreens/StoreScreen/styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  balanceSection: {
    alignItems: "center",
    marginTop: 18,
    paddingHorizontal: 18,
  },

  balanceLabel: {
    fontSize: 18,
    color: "#111",
    marginBottom: 12,
  },

  balanceCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",

    // soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,

    alignItems: "center",
    gap: 12,
  },

  balanceBadge: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  balanceTextWrap: {
    flex: 1,
  },

  balanceAmount: {
    fontSize: 28,
    color: "#111",
    lineHeight: 32,
  },

  balanceSub: {
    fontSize: 14,
    color: "#5A6B7A",
    marginTop: 2,
  },

  rewardsContainer: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#111",
    marginBottom: 12,
  },

  rewardCard: {
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  rewardRow: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textBox: {
    flex: 1,
    minWidth: 0,
  },

  rewardTitle: {
    fontSize: 16,
    color: "#111",
  },

  rewardSub: {
    fontSize: 13,
    color: "#5A6B7A",
    marginTop: 3,
  },

  priceBox: {
    minWidth: 108,
  },

  pricePill: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  rewardPrice: {
    fontSize: 16,
    color: "#111",
    lineHeight: 18,
  },

  rewardCoins: {
    fontSize: 12,
    color: "#5A6B7A",
    marginTop: 2,
  },
});