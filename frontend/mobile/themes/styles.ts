import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 20,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },

  link: {
    marginTop: 16,
    textAlign: "center",
    color: COLORS.secondary,
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

  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    },

    /*  SECCIONES */
section: {
  padding: 20,
},

sectionWhite: {
  backgroundColor: "white",
},

sectionCenter: {
  alignItems: "center",
},

/*  TEXTO */
text: {
  textAlign: "center",
  color: "#555",
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 16,
  color: COLORS.primary,
},

/*  CARDS LISTADO */
cardList: {
  backgroundColor: "white",
  borderRadius: 12,
  marginBottom: 16,
  overflow: "hidden",
  elevation: 3,
},

cardContent: {
  padding: 12,
},

cardTitle: {
  fontWeight: "600",
  color: COLORS.text,
},

cardText: {
  color: "#666",
  marginTop: 4,
},

/*  IMAGEN */
imagePlaceholder: {
  height: 140,
  backgroundColor: "#ddd",
},

/*  CTA */
cta: {
  backgroundColor: COLORS.primary,
  padding: 30,
  alignItems: "center",
},

ctaTitle: {
  color: "white",
  fontSize: 20,
  fontWeight: "600",
},

ctaText: {
  color: "white",
  marginTop: 8,
  textAlign: "center",
},
});