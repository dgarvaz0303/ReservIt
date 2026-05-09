"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { globalStyles } from "@/themes/styles";
import { reservasStyles as styles } from "@/themes/reservasLocalesStyles";

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

  const fetchReservas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `https://reservit.onrender.com/api/reservas/establecimiento/${establecimientoId}?fecha=${formatDate(fecha)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("RESERVAS:", data);
      setReservas(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const generarPDF = async () => {
    if (reservas.length === 0) return;

    const html = `<h1>Reservas</h1>`;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

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
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (nueva < hoy) return;

    setFecha(nueva);
  };

  const reservasFiltradas = filtrarReservas();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Reservas</Text>

      {/* HEADER */}
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
          {fecha.toLocaleDateString("es-ES")}
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
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay reservas</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/mis-establecimientos/[id]/reservas/[reservaid]",
                params: {
                  id: establecimientoId,
                  reservaid: item.id,
                },
              })
            }
          >
            <Text style={styles.cardTitle}>
              {item.nombre_cliente}
            </Text>

            <Text style={styles.cardInfo}>
              {item.hora} · {item.num_personas} personas
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