import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const misReservasStyles = StyleSheet.create({

  filters: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
  },

  filterBlock: {
    minWidth: 140,
  },

  filterLabel: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 4,
    fontWeight: "600",
  },

  filterInput: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
    fontSize: 13,
  },

  tramoContainer: {
    flexDirection: "row",
    gap: 6,
  },

  tramoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
  },

  tramoActive: {
    backgroundColor: COLORS.primary,
  },

  tramoText: {
    fontSize: 12,
    color: "#333",
  },

  tramoTextActive: {
    color: "white",
    fontWeight: "600",
  },
  estadoFilters: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
  gap: 10,
},

estadoBtn: {
  flex: 1,
  backgroundColor: "#eee",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},

estadoBtnActive: {
  backgroundColor: COLORS.primary,
},

estadoText: {
  color: "#333",
  fontWeight: "600",
},

estadoTextActive: {
  color: "#fff",
},

});