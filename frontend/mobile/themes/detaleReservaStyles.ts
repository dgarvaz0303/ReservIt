import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const detalleReservaStyles = StyleSheet.create({

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },

  backText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  outlineBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  outlineText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  qr: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },

  qrText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },

  estTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },

  info: {
    color: COLORS.text,
    marginBottom: 4,
  },

  actions: {
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    width: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },

  modalText: {
    color: COLORS.text,
    marginBottom: 10,
  },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  cancel: {
    color: COLORS.secondary,
  },

  confirm: {
    color: COLORS.accent,
    fontWeight: "600",
  },

});