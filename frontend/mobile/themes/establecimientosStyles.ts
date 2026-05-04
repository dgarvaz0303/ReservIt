import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const establecimientosStyles = StyleSheet.create({
  container: {
    padding: 16,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  logo: {
    width: 90,
    height: 40,
    resizeMode: "contain",
  },

  backText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  /* CARD */
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 170,
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },

  text: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },

  capacity: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 6,
    fontWeight: "500",
  },

  /* BOTONES */
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontWeight: "600",
  },

  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});