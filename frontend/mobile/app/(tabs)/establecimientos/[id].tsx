"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

export default function EstablecimientoDetalle() {
  const { id } = useLocalSearchParams();

  const [establecimiento, setEstablecimiento] = useState<any>(null);
  const [fecha, setFecha] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState<any[]>([]);
  const [personas, setPersonas] = useState(1);
  const [seleccion, setSeleccion] = useState<any>(null);

  useEffect(() => {
    fetchEstablecimiento();
    fetchDisponibilidad(formatDate(new Date()));
  }, []);

  useEffect(() => {
    fetchDisponibilidad(formatDate(fecha));
    setSeleccion(null);
  }, [fecha]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchEstablecimiento = async () => {
    const res = await fetch(
      `http://192.168.1.132:8000/api/establecimientos/${id}`
    );
    const data = await res.json();
    setEstablecimiento(data.data || data);
  };

  const fetchDisponibilidad = async (fechaSeleccionada: string) => {
    const res = await fetch(
      `http://192.168.1.132:8000/api/disponibilidad?establecimiento_id=${id}&fecha=${fechaSeleccionada}`
    );
    const data = await res.json();

    const unique = Array.from(
      new Map(
        (Array.isArray(data) ? data : data.data || []).map((item: any) => [
          item.hora + "-" + item.zona_id,
          item,
        ])
      ).values()
    );

    setDisponibilidad(unique);
  };

  const cambiarDia = (dias: number) => {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (nueva < hoy) return;

    setFecha(nueva);
  };

  const handleReservar = async () => {
    if (!seleccion) return;

    const token = await AsyncStorage.getItem("token");

    await fetch("http://192.168.1.132:8000/api/reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        establecimiento_id: Number(id),
        zona_id: seleccion.zona_id,
        fecha: formatDate(fecha),
        hora: seleccion.hora,
        num_personas: personas,
      }),
    });

    router.replace("/reservas");
  };

  const abrirCarta = async () => {
    if (!establecimiento?.carta_url) {
      alert("Este establecimiento no tiene carta");
      return;
    }

    await Linking.openURL(establecimiento.carta_url);
  };


  // ABRIR GOOGLE MAPS
const abrirMapa = async () => {
  if (!establecimiento?.direccion) {
    alert("Dirección no disponible");
    return;
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    establecimiento.direccion
  )}`;

  await Linking.openURL(url);
};



  // agrupar zonas
  const zonas: Record<string, any[]> = {};
  disponibilidad.forEach((item) => {
    if (!zonas[item.zona]) zonas[item.zona] = [];
    zonas[item.zona].push(item);
  });

  if (!establecimiento) return <Text>Cargando...</Text>;

  const ahora = new Date();
  const esHoy = fecha.toDateString() === ahora.toDateString();

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.section}>

        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: COLORS.secondary }]}
            onPress={() => router.push("/establecimientos")}
          >
            <Text style={globalStyles.buttonText}>← Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: COLORS.accent }]}
            onPress={abrirCarta}
          >
            <Text style={globalStyles.buttonText}>📄 Carta</Text>
          </TouchableOpacity>
        </View>

        {/* IMAGEN */}
        <Image
          source={{ uri: establecimiento.imagen_url }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        {/* INFO */}
        <View style={[globalStyles.card, { marginBottom: 20 }]}>
          <Text style={globalStyles.title}>
            {establecimiento.nombre}
          </Text>

          <Text style={globalStyles.cardText}>
            Tipo: {establecimiento.tipo}
          </Text>

          <Text style={globalStyles.cardText}>
            Dirección: {establecimiento.direccion}
          </Text>

          <Text style={globalStyles.cardText}>
            Teléfono: {establecimiento.telefono}
          </Text>
        </View>

        {/* MAPA */}
        <View style={[globalStyles.card, { marginBottom: 20 }]}>
          <Text style={globalStyles.sectionTitle}>Ubicación</Text>

          <Text style={globalStyles.cardText}>
            {establecimiento.direccion}
          </Text>

          <TouchableOpacity
            onPress={abrirMapa}
            style={[
              globalStyles.button,
              { marginTop: 10, backgroundColor: COLORS.primary },
            ]}
          >
            <Text style={globalStyles.buttonText}>
               Ver en Google Maps
            </Text>
          </TouchableOpacity>
        </View>

        {/* FECHA */}
        <View style={globalStyles.sectionCenter}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: COLORS.surface,
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            {/* BOTÓN IZQUIERDA */}
            <TouchableOpacity
              onPress={() => cambiarDia(-1)}
              style={{
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 20,
                width: 40,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>‹</Text>
            </TouchableOpacity>

            {/* FECHA */}
            <Text
              style={{
                color: COLORS.text,
                fontWeight: "600",
                fontSize: 15,
                textTransform: "capitalize",
              }}
            >
              {fecha.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>

            {/* BOTÓN DERECHA */}
            <TouchableOpacity
              onPress={() => cambiarDia(1)}
              style={{
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 20,
                width: 40,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PERSONAS */}
        <View style={globalStyles.sectionCenter}>
          <Text style={globalStyles.sectionTitle}>
            Número de personas
          </Text>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              style={globalStyles.button}
              onPress={() =>
                setPersonas(Math.max(1, personas - 1))
              }
            >
              <Text style={globalStyles.buttonText}>-</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 18 }}>{personas}</Text>

            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => setPersonas(personas + 1)}
            >
              <Text style={globalStyles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ZONAS */}
        {Object.keys(zonas).map((zona) => (
          <View key={zona} style={globalStyles.cardList}>
            <View style={globalStyles.cardContent}>

              <Text style={globalStyles.cardTitle}>
                {zona.toUpperCase()}
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {zonas[zona].map((item) => {
                  const hora = parseInt(item.hora.split(":")[0]);

                  const horaPasada =
                    esHoy && hora <= ahora.getHours();

                  const sinCapacidad =
                    item.disponibles < personas;

                  const disabled = horaPasada || sinCapacidad;

                  const isSelected =
                    seleccion?.hora === item.hora &&
                    seleccion?.zona_id === item.zona_id;

                  return (
                    <TouchableOpacity
                      key={`${item.hora}-${item.zona_id}`}
                      disabled={disabled}
                      onPress={() => setSeleccion(item)}
                      style={{
                        margin: 5,
                        padding: 10,
                        borderRadius: 20,
                        alignItems: "center",
                        backgroundColor: isSelected
                          ? COLORS.primary
                          : disabled
                          ? "#ddd"
                          : item.disponibles <= 2
                          ? "#ffe5e5"
                          : "#e8f5e9",
                      }}
                    >
                      {/* HORA */}
                      <Text
                        style={{
                          color: isSelected ? "white" : COLORS.text,
                          fontSize: 13,
                        }}
                      >
                        {item.hora}
                      </Text>

                      {/* CAPACIDAD */}
                      <Text
                        style={{
                          fontSize: 11,
                          marginTop: 2,
                          color: isSelected
                            ? "white"
                            : item.disponibles <= 2
                            ? COLORS.accent
                            : COLORS.success,
                        }}
                      >
                        👥 {item.disponibles}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

            </View>
          </View>
        ))}

        {/* BOTÓN */}
        <TouchableOpacity
          disabled={!seleccion}
          onPress={handleReservar}
          style={[
            globalStyles.button,
            { marginTop: 20, opacity: seleccion ? 1 : 0.5 },
          ]}
        >
          <Text style={globalStyles.buttonText}>
            Confirmar reserva
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}