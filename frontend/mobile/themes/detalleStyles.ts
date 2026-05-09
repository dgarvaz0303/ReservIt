import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const detalleStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  back: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  cartaBtn: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 8,
  },
  disabledHora: {
  backgroundColor: "#ddd",
  opacity: 0.5,
},

  cartaText: {
    color: "white",
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },

  text: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },

  mapBtn: {
    marginTop: 10,
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  mapText: {
    color: "white",
  },

  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  date: {
    fontWeight: "600",
  },

  arrow: {
    fontSize: 22,
    color: COLORS.primary,
  },

  people: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 16,
  },

  peopleNumber: {
    fontSize: 18,
  },

  circle: {
    backgroundColor: COLORS.primary,
    color: "white",
    padding: 10,
    borderRadius: 20,
    width: 40,
    textAlign: "center",
  },

  zona: {
    fontWeight: "600",
    marginBottom: 10,
  },

  horas: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  horaBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
    margin: 5,
    alignItems: "center",
  },

  activeHora: {
    backgroundColor: COLORS.primary,
  },

  small: {
    fontSize: 11,
  },

  reservar: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  reservarText: {
    color: "white",
    fontWeight: "600",
  },
});