import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const crearEstStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  zonaInput: {
    flex: 1,
  },

  capInput: {
    width: 80,
  },

  removeBtn: {
    padding: 6,
  },

  addText: {
    color: COLORS.primary,
    marginTop: 8,
    fontWeight: "500",
  },

  pickerContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
  },

  imagePreview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 10,
  },

  fileName: {
    marginTop: 8,
    color: "#666",
  },

  uploadBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },

  uploadText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});