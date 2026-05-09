import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const detalleReservaStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  backBtn: {
  alignSelf: "flex-start",
  marginBottom: 10,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: "#eee",
},

backText: {
  color: COLORS.primary,
  fontWeight: "600",
},

  cameraOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  scanBox: {
    width: 250,
    height: 250,
  },

  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "white",
  },

  topLeft: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3 },
  topRight: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 3, borderBottomWidth: 3 },

  laser: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },

  scanText: {
    color: "white",
    marginTop: 20,
  },

  scannerButtons: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    padding: 20,
  },

  validationOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  ok: { backgroundColor: "#4CAF50" },
  error: { backgroundColor: "#e53935" },

  validationIcon: {
    fontSize: 80,
    color: "white",
  },

  validationText: {
    fontSize: 18,
    color: "white",
    marginTop: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },

  badge: {
    marginTop: 10,
    padding: 6,
    borderRadius: 10,
  },

  badgeActive: {
    backgroundColor: "#e8f5e9",
    color: "green",
  },

  badgeUsed: {
    backgroundColor: "#eee",
  },

  deleteBtn: {
    backgroundColor: COLORS.accent,
  },

  cancelBtn: {
    backgroundColor: "#666",
  },
});