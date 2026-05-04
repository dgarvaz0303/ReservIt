import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const detalleSupervisorStyles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },

  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },

  backText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  image: {
    width: "100%",
    height: 230,
    borderRadius: 16,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },

  info: {
    color: COLORS.text,
    marginTop: 6,
    fontSize: 14,
  },

  actions: {
    marginTop: 20,
    gap: 12,
  },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontWeight: "600",
  },

  deleteBtn: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteText: {
    color: COLORS.accent,
    fontWeight: "600",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    width: "85%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },

  modalText: {
    color: COLORS.text,
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  cancel: {
    color: COLORS.secondary,
  },

  confirm: {
    color: COLORS.accent,
    fontWeight: "600",
  },
});