"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
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

    // eliminar duplicados por hora + zona
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

    // REDIRECCIÓN
    router.replace("/reservas");
  };

  // agrupar zonas
  const zonas: Record<string, any[]> = {};
  disponibilidad.forEach((item) => {
    if (!zonas[item.zona]) zonas[item.zona] = [];
    zonas[item.zona].push(item);
  });

  if (!establecimiento) return <Text>Cargando...</Text>;

  const ahora = new Date();
  const esHoy =
    fecha.toDateString() === ahora.toDateString();

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.section}>

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

        {/* FECHA */}
        <View style={globalStyles.sectionCenter}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity onPress={() => cambiarDia(-1)}>
              <Text>{"<"}</Text>
            </TouchableOpacity>

            <Text>
              {fecha.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>

            <TouchableOpacity onPress={() => cambiarDia(1)}>
              <Text>{">"}</Text>
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
                {zonas[zona].map((item, i) => {
                  const hora = parseInt(item.hora.split(":")[0]);

                  const horaPasada =
                    esHoy && hora <= ahora.getHours();

                  const sinCapacidad =
                    item.disponibles < personas;

                  const disabled = horaPasada || sinCapacidad;

                  return (
                    <TouchableOpacity
                      key={i}
                      disabled={disabled}
                      onPress={() => setSeleccion(item)}
                      style={{
                        margin: 5,
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor:
                          seleccion?.hora === item.hora &&
                          seleccion?.zona_id === item.zona_id
                            ? COLORS.primary
                            : disabled
                            ? "#ddd"
                            : "#e8f0ea",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            seleccion?.hora === item.hora &&
                            seleccion?.zona_id === item.zona_id
                              ? "white"
                              : COLORS.text,
                        }}
                      >
                        {item.hora}
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