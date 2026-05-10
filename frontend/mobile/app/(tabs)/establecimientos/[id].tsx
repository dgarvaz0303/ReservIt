import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS } from "@/themes/colors";
import { detalleStyles as styles } from "@/themes/detalleStyles";

export default function EstablecimientoDetalle() {
  const { id } = useLocalSearchParams();

  const cargadoInicial = useRef(false);

  const [establecimiento, setEstablecimiento] = useState<any>(null);
  const [fecha, setFecha] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState<any[]>([]);
  const [personas, setPersonas] = useState(1);
  const [seleccion, setSeleccion] = useState<any>(null);
  const [loadingReserva, setLoadingReserva] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA");
  };

  useEffect(() => {
    if (!id) return;
    if (cargadoInicial.current) return;

    cargadoInicial.current = true;

    fetchEstablecimiento();
    fetchDisponibilidad(formatDate(fecha));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (!cargadoInicial.current) return;

    fetchDisponibilidad(formatDate(fecha));
    setSeleccion(null);
  }, [fecha]);

  useEffect(() => {
    if (!seleccion) return;

    const invalida =
      seleccion.disponibles < personas || horaPasada(seleccion.hora);

    if (invalida) {
      setSeleccion(null);
    }
  }, [personas, fecha, disponibilidad]);

  const fetchEstablecimiento = async () => {
    try {
      const res = await fetch(
        `https://reservit.onrender.com/api/establecimientos/${id}`
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error establecimiento:", data);
        setEstablecimiento(null);
        return;
      }

      setEstablecimiento(data.data || data);
    } catch (error) {
      console.log("Error conexión establecimiento:", error);
      setEstablecimiento(null);
    }
  };

  const fetchDisponibilidad = async (fechaSeleccionada: string) => {
    try {
      const res = await fetch(
        `https://reservit.onrender.com/api/disponibilidad?establecimiento_id=${id}&fecha=${fechaSeleccionada}`
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error disponibilidad:", data);
        setDisponibilidad([]);
        return;
      }

      const rawData = Array.isArray(data) ? data : data.data || [];

      const unique = Array.from(
        new Map(
          rawData.map((item: any) => [
            item.hora + "-" + item.zona_id,
            item,
          ])
        ).values()
      );

      setDisponibilidad(unique);
    } catch (error) {
      console.log("Error conexión disponibilidad:", error);
      setDisponibilidad([]);
    }
  };

  const cambiarDia = (dias: number) => {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (nueva < hoy) return;

    setFecha(nueva);
  };

  const horaPasada = (horaString: string) => {
    if (!horaString) return false;

    const ahora = new Date();
    const [h, m] = horaString.split(":");

    const reservaHora = new Date(fecha);
    reservaHora.setHours(Number(h), Number(m), 0, 0);

    return reservaHora < ahora;
  };

  const handleReservar = async () => {
    if (!seleccion || loadingReserva) return;

    try {
      setLoadingReserva(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Debes iniciar sesión para reservar");
        return;
      }

      const res = await fetch("https://reservit.onrender.com/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          establecimiento_id: Number(id),
          zona_id: Number(seleccion.zona_id),
          fecha: formatDate(fecha),
          hora: seleccion.hora,
          num_personas: Number(personas),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.detail || "Error al reservar");
        return;
      }

      Alert.alert(
        "Reserva creada",
        "La reserva se ha realizado correctamente"
      );

      router.replace("/reservas");
    } catch (error) {
      console.log("Error reserva:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoadingReserva(false);
    }
  };

  const abrirCarta = async () => {
    if (!establecimiento?.carta_url) {
      Alert.alert("Sin carta", "Este establecimiento no tiene carta");
      return;
    }

    await Linking.openURL(establecimiento.carta_url);
  };

  const abrirMapa = async () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      establecimiento.direccion
    )}`;

    await Linking.openURL(url);
  };

  const zonas: Record<string, any[]> = {};

  disponibilidad.forEach((item) => {
    if (!zonas[item.zona]) {
      zonas[item.zona] = [];
    }

    zonas[item.zona].push(item);
  });

  if (!establecimiento) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartaBtn} onPress={abrirCarta}>
          <Text style={styles.cartaText}>Carta</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri:
            establecimiento.imagen_url ||
            "https://via.placeholder.com/400x250.png?text=ReservIt",
        }}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.title}>{establecimiento.nombre}</Text>
        <Text style={styles.text}>{establecimiento.tipo}</Text>
        <Text style={styles.text}>{establecimiento.direccion}</Text>
        <Text style={styles.text}>{establecimiento.telefono}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ubicación</Text>

        <TouchableOpacity style={styles.mapBtn} onPress={abrirMapa}>
          <Text style={styles.mapText}>Ver en Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => cambiarDia(-1)}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.date}>
          {fecha.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>

        <TouchableOpacity onPress={() => cambiarDia(1)}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.people}>
        <TouchableOpacity onPress={() => setPersonas(Math.max(1, personas - 1))}>
          <Text style={styles.circle}>-</Text>
        </TouchableOpacity>

        <Text style={styles.peopleNumber}>{personas}</Text>

        <TouchableOpacity onPress={() => setPersonas(Math.min(20, personas + 1))}>
          <Text style={styles.circle}>+</Text>
        </TouchableOpacity>
      </View>

      {Object.keys(zonas).map((zona) => (
        <View key={zona} style={styles.card}>
          <Text style={styles.zona}>{zona.toUpperCase()}</Text>

          <View style={styles.horas}>
            {zonas[zona].map((item) => {
              const pasada = horaPasada(item.hora);
              const sinCapacidad = item.disponibles < personas;
              const disabled = pasada || sinCapacidad;

              if (sinCapacidad) return null;

              const isSelected =
                seleccion?.hora === item.hora &&
                seleccion?.zona_id === item.zona_id;

              return (
                <TouchableOpacity
                  key={item.hora + item.zona_id}
                  disabled={disabled}
                  onPress={() => !disabled && setSeleccion(item)}
                  style={[
                    styles.horaBtn,
                    isSelected && styles.activeHora,
                    disabled && styles.disabledHora,
                  ]}
                >
                  <Text
                    style={{
                      color: disabled
                        ? "#777"
                        : isSelected
                        ? "#fff"
                        : COLORS.text,
                    }}
                  >
                    {item.hora}
                  </Text>

                  <Text
                    style={[
                      styles.small,
                      {
                        color: disabled
                          ? "#777"
                          : isSelected
                          ? "#fff"
                          : COLORS.text,
                      },
                    ]}
                  >
                    👥 {item.disponibles}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableOpacity
        disabled={!seleccion || loadingReserva}
        onPress={handleReservar}
        style={[
          styles.reservar,
          {
            opacity: seleccion && !loadingReserva ? 1 : 0.5,
          },
        ]}
      >
        <Text style={styles.reservarText}>
          {loadingReserva ? "Reservando..." : "Confirmar reserva"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}