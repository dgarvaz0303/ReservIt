import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const editarPerfilStyles = StyleSheet.create({
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

  label: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "500",
  },

  disabledBtn: {
    backgroundColor: "#aaa",
  },
});