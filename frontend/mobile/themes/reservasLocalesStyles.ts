import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const reservasStyles = StyleSheet.create({
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  primaryText: {
    color: "white",
    fontWeight: "600",
  },

  outlineBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  outlineText: {
    color: COLORS.primary,
    fontWeight: "500",
  },

  dateCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3,
  },

  arrow: {
    fontSize: 18,
    color: COLORS.primary,
  },

  dateText: {
    fontWeight: "600",
    color: COLORS.text,
  },

  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },

  filterActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    fontSize: 12,
    color: COLORS.text,
  },

  filterTextActive: {
    color: "white",
  },

  listContent: {
    paddingBottom: 30,
  },

  empty: {
    textAlign: "center",
    color: COLORS.text,
    marginTop: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    elevation: 2,
  },

  cardTitle: {
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },

  cardInfo: {
    fontSize: 13,
    color: "#666",
  },
});