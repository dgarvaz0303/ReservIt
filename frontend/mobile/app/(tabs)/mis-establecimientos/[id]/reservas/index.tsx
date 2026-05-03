"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

export default function ReservasEstablecimiento() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const establecimientoId = Array.isArray(id) ? id[0] : id;

  const [reservas, setReservas] = useState<any[]>([]);
  const [fecha, setFecha] = useState(new Date());
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    if (establecimientoId) {
      fetchReservas();
    }
  }, [fecha, establecimientoId]);

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  // =========================
  // FETCH
  // =========================
  const fetchReservas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `http://192.168.1.132:8000/api/reservas/establecimiento/${establecimientoId}?fecha=${formatDate(fecha)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setReservas(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.log("ERROR FETCH RESERVAS:", err);
    }
  };

  // =========================
  // PDF PRO
  // =========================
  const generarPDF = async () => {
    if (reservas.length === 0) {
      Alert.alert("Sin datos", "No hay reservas para este día");
      return;
    }

    const fechaStr = fecha.toLocaleDateString("es-ES");

    //  AGRUPAR POR HORA
    const agrupadas: any = {};

    reservas.forEach((r) => {
      if (!agrupadas[r.hora]) agrupadas[r.hora] = [];
      agrupadas[r.hora].push(r);
    });

    const horas = Object.keys(agrupadas).sort();

    // HTML PDF
    const html = `
    <html>
      <body style="font-family: Arial; padding: 20px;">

        <!-- LOGO -->
        <div style="text-align:center; margin-bottom:20px;">
          <img src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png" width="120"/>
        </div>

        <h1 style="text-align:center;">Reservas del día</h1>

        <p><strong>Fecha:</strong> ${fechaStr}</p>

        <hr/>

        ${horas
          .map((hora) => {
            const lista = agrupadas[hora];

            const total = lista.reduce(
              (acc: number, r: any) =>
                acc + Number(r.num_personas || 0),
              0
            );

            return `
              <div style="margin-top:15px;">
                <h3 style="background:#eee; padding:6px;">
                  ${hora} (${total} personas)
                </h3>

                ${lista
                  .map(
                    (r: any) => `
                  <p>
                    • ${r.nombre_cliente || "Cliente"} 
                    (${r.num_personas}) - 
                    ${r.zona_nombre || "General"}
                  </p>
                `
                  )
                  .join("")}
              </div>
            `;
          })
          .join("")}

      </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(uri);
  };

  // =========================
  // FILTRO
  // =========================
  const filtrarReservas = () => {
    if (filtro === "todas") return reservas;

    return reservas.filter((r) => {
      const hora = parseInt(r.hora.split(":")[0]);

      if (filtro === "mañana") return hora <= 12;
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

  if (!establecimientoId) {
    return (
      <View style={globalStyles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Reservas</Text>

      {/* BOTONES TOP */}
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() =>
            router.push(`/mis-establecimientos/${establecimientoId}`)
          }
        >
          <Text style={styles.outlineText}>← Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={generarPDF}
        >
          <Text style={styles.primaryText}>PDF</Text>
        </TouchableOpacity>
      </View>

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
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA */}
      <FlatList
        data={reservasFiltradas}
        keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={globalStyles.text}>
            No hay reservas
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname:
                  "/mis-establecimientos/[id]/reservas/[reservaid]",
                params: {
                  id: establecimientoId,
                  reservaid: item.id,
                },
              })
            }
          >
            <Text style={styles.cardTitle}>
              {item.nombre_cliente || "Reserva"}
            </Text>

            <Text style={styles.cardInfo}>
               {item.hora}
            </Text>

            <Text style={styles.cardInfo}>
               {item.num_personas} personas
            </Text>

            <Text style={styles.cardInfo}>
               {item.zona_nombre || "General"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
  },

  primaryText: {
    color: "white",
    fontWeight: "600",
  },

  outlineBtn: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
  },

  outlineText: {
    color: COLORS.primary,
  },

  dateCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  arrow: { fontSize: 20, color: COLORS.primary },

  dateText: { fontWeight: "600", color: COLORS.text },

  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  filterBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },

  filterActive: { backgroundColor: COLORS.primary },

  filterText: { fontSize: 12 },

  filterTextActive: { color: "white" },

  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },

  cardTitle: { fontWeight: "600" },

  cardInfo: { fontSize: 13 },
});