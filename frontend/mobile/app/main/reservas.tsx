import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { globalStyles } from "@/styles/globalStyles";
import { COLORS } from "@/styles/colors";

export default function MisReservas() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTramo, setFiltroTramo] = useState("");

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch("http://192.168.1.132:8000/api/reservas/mis", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const ordenadas = data.sort(
      (a: any, b: any) =>
        new Date(`${a.fecha} ${a.hora}`).getTime() -
        new Date(`${b.fecha} ${b.hora}`).getTime()
    );

    setReservas(ordenadas);
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

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.section}>

        {/* HEADER */}
        <Text style={globalStyles.title}>
          Mis reservas
        </Text>

        {/* FILTROS */}
        <TextInput
          placeholder="Filtrar por fecha (YYYY-MM-DD)"
          value={filtroFecha}
          onChangeText={setFiltroFecha}
          style={globalStyles.input}
        />

        <TextInput
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChangeText={setFiltroNombre}
          style={globalStyles.input}
        />

        {/* LISTA */}
        {reservas.filter(filtrar).map((r) => {

          const fechaReserva = new Date(`${r.fecha} ${r.hora}`);
          const ahora = new Date();
          const esPasada = fechaReserva < ahora;

          return (
            <TouchableOpacity
              key={r.id}
              onPress={() => router.push(`/reservas/${r.id}`)}
              style={globalStyles.cardList}
            >

              {/* IMAGEN */}
              <Image
                source={{ uri: r.imagen_url }}
                style={globalStyles.imagePlaceholder}
              />

              <View style={globalStyles.cardContent}>

                <Text style={globalStyles.cardTitle}>
                  {r.establecimiento_nombre}
                </Text>

                <Text style={globalStyles.cardText}>
                  {r.fecha} - {r.hora}
                </Text>

                <Text style={globalStyles.cardText}>
                  Zona: {r.zona}
                </Text>

                {/* ESTADO */}
                <Text
                  style={{
                    marginTop: 6,
                    color: esPasada ? "#888" : COLORS.success,
                    fontSize: 12,
                  }}
                >
                  {esPasada ? "Reserva pasada" : "Próxima reserva"}
                </Text>

              </View>

            </TouchableOpacity>
          );
        })}

      </View>
    </ScrollView>
  );
}