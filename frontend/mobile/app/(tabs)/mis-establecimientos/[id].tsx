import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

export default function ReservasEstablecimiento() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [reservas, setReservas] = useState<any[]>([]);
  const [fecha, setFecha] = useState(new Date());
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    fetchReservas();
  }, [fecha]);

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  const fetchReservas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `http://192.168.1.132:8000/api/reservas/establecimiento/${id}?fecha=${formatDate(fecha)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const filtrarReservas = () => {
    if (filtro === "todas") return reservas;

    return reservas.filter((r) => {
      const hora = parseInt(r.hora.split(":")[0]);

      if (filtro === "mañana") return hora >= 8 && hora <= 12;
      if (filtro === "tarde") return hora >= 13 && hora <= 19;
      if (filtro === "noche") return hora >= 20;

      return true;
    });
  };

  const cambiarDia = (dias: number) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (nuevaFecha < hoy) return;

    setFecha(nuevaFecha);
  };

  const reservasFiltradas = filtrarReservas();

  return (
    <View style={globalStyles.container}>

      {/* HEADER */}
      <Text style={globalStyles.title}>Reservas</Text>

      {/* FECHA */}
      <View style={styles.dateCard}>
        <TouchableOpacity onPress={() => cambiarDia(-1)}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>
          {fecha.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </Text>

        <TouchableOpacity onPress={() => cambiarDia(1)}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <View style={styles.filters}>
        {["mañana", "tarde", "noche", "todas"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFiltro(f)}
            style={[
              styles.filterBtn,
              filtro === f && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filtro === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA */}
      <FlatList
        data={reservasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={globalStyles.text}>
            No hay reservas para este día
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/main/reservas/${item.id}`)
            }
          >
            <Text style={styles.cardTitle}>
              {item.nombre_cliente || "Reserva"}
            </Text>

            <Text style={styles.cardInfo}>
              🕒 {item.hora}
            </Text>

            <Text style={styles.cardInfo}>
              👥 {item.num_personas} personas
            </Text>

            <Text style={styles.cardInfo}>
              📍 Zona: {item.zona_nombre || item.zona_id}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  /* FECHA */
  dateCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  arrow: {
    fontSize: 20,
    color: COLORS.primary,
  },

  dateText: {
    fontWeight: "600",
    color: COLORS.text,
  },

  /* FILTROS */
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
  },

  filterActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    fontSize: 12,
    color: "#555",
  },

  filterTextActive: {
    color: "white",
    fontWeight: "600",
  },

  /* CARD */
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },

  cardTitle: {
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },

  cardInfo: {
    color: COLORS.text,
    fontSize: 13,
  },
});