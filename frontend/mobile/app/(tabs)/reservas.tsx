"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { globalStyles } from "../../themes/styles";
import { COLORS } from "../../themes/colors";
import { misReservasStyles as styles } from "../../themes/misReservasStyles";

export default function MisReservas() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTramo, setFiltroTramo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activas");
  useFocusEffect(
    useCallback(() => {
      fetchReservas();
    }, [])
  );

  const fetchReservas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        "https://reservit.onrender.com/api/reservas/mis",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = await res.json();
      const data = Array.isArray(raw) ? raw : raw.data || [];

      const ordenadas = data.sort(
        (a: any, b: any) =>
          new Date(`${a.fecha} ${a.hora}`).getTime() -
          new Date(`${b.fecha} ${b.hora}`).getTime()
      );

      setReservas(ordenadas);
    } catch (err) {
      console.log(err);
    }
  };

  const filtrar = (r: any) => {   
    const matchFecha =
      !filtroFecha || r.fecha === filtroFecha;

    const matchNombre =
      !filtroNombre ||
      r.establecimiento_nombre
        ?.toLowerCase()
        .includes(filtroNombre.toLowerCase());

    const hora = parseInt(r.hora.split(":")[0]);

    const matchTramo =
      !filtroTramo ||
      (filtroTramo === "mañana" && hora < 13) ||
      (filtroTramo === "tarde" && hora >= 13 && hora < 20) ||
      (filtroTramo === "noche" && hora >= 20);

    // =========================
    // ESTADO RESERVA
    // =========================

    const fechaReserva = new Date(
      `${r.fecha}T${r.hora}`
    );

    const pasada = fechaReserva < new Date();

    const activa = !pasada;

    const finalizada =
      pasada && r.qr_usado === true;

    const perdida =
      pasada && r.qr_usado === false;

    const matchEstado =
      (filtroEstado === "activas" && activa) ||
      (filtroEstado === "finalizadas" && finalizada) ||
      (filtroEstado === "perdidas" && perdida);

    return (
      matchFecha &&
      matchNombre &&
      matchTramo &&
      matchEstado
    );
  };

  const filtradas = reservas.filter(filtrar);

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Mis reservas</Text>
      <View style={styles.estadoFilters}>

        <TouchableOpacity
          onPress={() => setFiltroEstado("activas")}
          style={[
            styles.estadoBtn,
            filtroEstado === "activas" &&
              styles.estadoBtnActive,
          ]}
        >
          <Text
            style={[
              styles.estadoText,
              filtroEstado === "activas" &&
                styles.estadoTextActive,
            ]}
          >
            Activas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFiltroEstado("finalizadas")}
          style={[
            styles.estadoBtn,
            filtroEstado === "finalizadas" &&
              styles.estadoBtnActive,
          ]}
        >
          <Text
            style={[
              styles.estadoText,
              filtroEstado === "finalizadas" &&
                styles.estadoTextActive,
            ]}
          >
            Finalizadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFiltroEstado("perdidas")}
          style={[
            styles.estadoBtn,
            filtroEstado === "perdidas" &&
              styles.estadoBtnActive,
          ]}
        >
          <Text
            style={[
              styles.estadoText,
              filtroEstado === "perdidas" &&
                styles.estadoTextActive,
            ]}
          >
            Perdidas
          </Text>
        </TouchableOpacity>

      </View>



      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {/* FECHA */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Fecha</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={filtroFecha}
            onChangeText={setFiltroFecha}
            style={styles.filterInput}
          />
        </View>

        {/* NOMBRE */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Establecimiento</Text>
          <TextInput
            placeholder="Buscar..."
            value={filtroNombre}
            onChangeText={setFiltroNombre}
            style={styles.filterInput}
          />
        </View>

        {/* TRAMO */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Tramo</Text>

          <View style={styles.tramoContainer}>
            {["mañana", "tarde", "noche"].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setFiltroTramo(t)}
                style={[
                  styles.tramoBtn,
                  filtroTramo === t && styles.tramoActive,
                ]}
              >
                <Text
                  style={[
                    styles.tramoText,
                    filtroTramo === t && styles.tramoTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* LISTA */}
      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const fechaReserva = new Date(
            `${item.fecha}T${item.hora}`
          );
          const esPasada = fechaReserva < new Date();

          return (
            <TouchableOpacity
              style={globalStyles.cardList}
              onPress={() =>
                router.push({
                  pathname: "/reservas/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Image
                source={{
                  uri:
                    item.imagen_url ||
                    "https://via.placeholder.com/300",
                }}
                style={globalStyles.imagePlaceholder}
              />

              <View style={globalStyles.cardContent}>
                <Text style={globalStyles.cardTitle}>
                  {item.establecimiento_nombre}
                </Text>

                <Text style={globalStyles.cardText}>
                  {item.fecha} - {item.hora}
                </Text>

                <Text style={globalStyles.cardText}>
                  Zona: {item.zona}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color:
                    !esPasada
                      ? COLORS.success
                      : item.qr_usado
                      ? "#3b82f6"
                      : "#ef4444",
                  }}
                >
                  {!esPasada
                  ? "Reserva activa"
                  : item.qr_usado
                  ? "Reserva finalizada"
                  : "Reserva perdida"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}