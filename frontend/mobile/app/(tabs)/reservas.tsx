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

  useFocusEffect(
    useCallback(() => {
      fetchReservas();
    }, [])
  );

  const fetchReservas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        "http://192.168.1.132:8000/api/reservas/mis",
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
    const matchFecha = !filtroFecha || r.fecha === filtroFecha;

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

    return matchFecha && matchNombre && matchTramo;
  };

  const filtradas = reservas.filter(filtrar);

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Mis reservas</Text>

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
          const fechaReserva = new Date(`${item.fecha} ${item.hora}`);
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
                    color: esPasada
                      ? "#999"
                      : COLORS.success,
                  }}
                >
                  {esPasada
                    ? "Reserva pasada"
                    : "Próxima reserva"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}