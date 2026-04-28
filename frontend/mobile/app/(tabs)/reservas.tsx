import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../themes/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../themes/colors";

export default function MisReservas() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTramo, setFiltroTramo] = useState("");

  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No hay token");
        return;
      }

      const res = await fetch("http://192.168.1.132:8000/api/reservas/mis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

      {/* HEADER */}
      <Text style={globalStyles.title}>Mis reservas</Text>

      {/* FILTROS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filters}>

          <TextInput
            placeholder="📅 Fecha"
            value={filtroFecha}
            onChangeText={setFiltroFecha}
            style={globalStyles.input}
          />

          <TextInput
            placeholder="🔍 Buscar"
            value={filtroNombre}
            onChangeText={setFiltroNombre}
            style={globalStyles.input}
          />

          <TextInput
            placeholder="🌙 mañana / tarde / noche"
            value={filtroTramo}
            onChangeText={setFiltroTramo}
            style={globalStyles.input}
          />

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
                navigation.navigate("DetalleReserva", { id: item.id })
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
                  📅 {item.fecha} - {item.hora}
                </Text>

                <Text style={globalStyles.cardText}>
                  Zona: {item.zona}
                </Text>

                {/* ESTADO */}
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: esPasada
                      ? "#999"
                      : COLORS.success,
                  }}
                >
                  {esPasada ? "Reserva pasada" : "Próxima reserva"}
                </Text>

              </View>
            </TouchableOpacity>
          );
        }}
      />

    </View>
  );
}

/* SOLO LO ESPECÍFICO */
const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
});