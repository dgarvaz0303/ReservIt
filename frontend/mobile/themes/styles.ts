import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 20,
    justifyContent: "center",
  },
  scroll: {
  flex: 1,
  backgroundColor: COLORS.bg,
},
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 22,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },

  cardText: {
    color: COLORS.text,
    marginTop: 4,
    fontSize: 14,
    opacity: 0.8,
  },
  cardTitle: {
  fontWeight: "600",
  color: COLORS.text,
  fontSize: 15,
},  
  input: {
    backgroundColor: "#f7f7f7",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    color: "#111",
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "500",
  },

  link: {
    marginTop: 16,
    textAlign: "center",
    color: COLORS.secondary,
  },

  label: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "500",
  },

  error: {
    color: COLORS.accent,
    marginTop: 10,
    textAlign: "center",
  },

  success: {
    color: COLORS.success,
    marginTop: 10,
    textAlign: "center",
  },
  /* ===== SECCIONES ===== */
section: {
  paddingVertical: 30,
  paddingHorizontal: 20,
},

sectionWhite: {
  backgroundColor: "white",
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "600",
  color: COLORS.primary,
  marginBottom: 16,
  textAlign: "center",
},

text: {
  textAlign: "center",
  color: "#555",
  fontSize: 14,
  lineHeight: 20,
},
cardList: {
  backgroundColor: "white",
  borderRadius: 16,
  marginBottom: 16,
  overflow: "hidden",
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},

imagePlaceholder: {
  width: "100%",
  height: 150,
},

cardContent: {
  padding: 14,
},
});