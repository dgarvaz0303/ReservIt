import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const misEstStyles = StyleSheet.create({
  header: {
    marginBottom: 25,
  },

  createBtn: {
    marginTop: 12,
    borderRadius: 12,
  },

  filtros: {
    marginBottom: 20,
    gap: 10,
  },

  card: {
    marginBottom: 16,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 150,
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  text: {
    color: "#666",
    marginTop: 4,
    fontSize: 13,
  },

  deleteBtn: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 10,
    borderRadius: 10,
    margin: 12,
    alignItems: "center",
  },

  deleteText: {
    color: COLORS.accent,
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 14,
  },

  modalText: {
    color: COLORS.text,
    marginBottom: 10,
  },

  cancelText: {
    color: COLORS.secondary,
    textAlign: "center",
    marginTop: 12,
  },
});