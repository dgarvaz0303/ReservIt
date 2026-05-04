import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const perfilStyles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 15,
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  backText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  historialItem: {
    marginRight: 12,
    width: 140,
  },

  historialImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});