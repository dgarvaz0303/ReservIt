import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const landingStyles = StyleSheet.create({

  /* HERO */
  hero: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },

  heroText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    opacity: 0.9,
  },

  /* CARDS */
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  cardImage: {
    width: "100%",
    height: 160,
  },

  cardContent: {
    padding: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },

  cardText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  /* FEATURES */
  feature: {
    marginTop: 16,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  featureText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  /* CTA */
  cta: {
    backgroundColor: COLORS.primary,
    padding: 30,
    alignItems: "center",
  },

  ctaTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});