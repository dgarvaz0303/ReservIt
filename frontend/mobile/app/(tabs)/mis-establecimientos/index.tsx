import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { globalStyles } from "../../../themes/styles";
import { COLORS } from "../../../themes/colors";

export default function MisEstablecimientosScreen() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8000/api/establecimientos/propietario",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setEstablecimientos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const eliminar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/establecimientos/${selectedId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedId(null);
      setConfirmText("");
      fetchEstablecimientos();
    } catch (err) {
      console.log(err);
    }
  };

  const filtrados = establecimientos.filter((e) => {
    const matchNombre = e.nombre
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchTipo = tipo
      ? e.tipo?.toLowerCase().includes(tipo.toLowerCase())
      : true;

    return matchNombre && matchTipo;
  });

    return (
    <View style={globalStyles.container}>

      {/* HEADER */}
      <View style={{ marginBottom: 25 }}>
        <Text style={globalStyles.title}>Mis establecimientos</Text>

        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 10 }]}
          onPress={() => navigation.navigate("CrearEstablecimiento")}
        >
          <Text style={globalStyles.buttonText}>+ Crear nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <View style={{ marginBottom: 20, gap: 10 }}>
        <TextInput
          placeholder="Buscar establecimiento..."
          value={search}
          onChangeText={setSearch}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Tipo (Bar, Restaurante...)"
          value={tipo}
          onChangeText={setTipo}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />
      </View>

      {/* LISTA */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[globalStyles.cardList, { marginBottom: 16 }]}>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("DetalleEstablecimiento", {
                  id: item.id,
                })
              }
            >
              <Image
                source={{
                  uri:
                    item.imagen_url ||
                    "https://via.placeholder.com/300",
                }}
                style={{
                  width: "100%",
                  height: 150,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />

              <View style={globalStyles.cardContent}>
                <Text style={globalStyles.cardTitle}>
                  {item.nombre}
                </Text>

                <Text style={globalStyles.cardText}>
                  {item.direccion}
                </Text>

                <Text style={globalStyles.cardText}>
                  Capacidad: {item.capacidad}
                </Text>

                <Text style={globalStyles.cardText}>
                  {item.tipo}
                </Text>
              </View>
            </TouchableOpacity>

            {/* BOTÓN ELIMINAR */}
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: COLORS.accent,
                padding: 10,
                borderRadius: 10,
                margin: 12,
                alignItems: "center",
              }}
              onPress={() => setSelectedId(item.id)}
            >
              <Text style={{ color: COLORS.accent }}>
                Eliminar
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={!!selectedId} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={[
              globalStyles.card,
              { width: "100%", maxWidth: 320 },
            ]}
          >

            <Text style={globalStyles.sectionTitle}>
              ¿Eliminar establecimiento?
            </Text>

            <Text style={{ color: COLORS.text, marginBottom: 10 }}>
              Escribe DELETE para confirmar
            </Text>

            <TextInput
              placeholder="DELETE"
              value={confirmText}
              onChangeText={setConfirmText}
              style={globalStyles.input}
              placeholderTextColor="#888"
            />

            <TouchableOpacity
              disabled={confirmText !== "DELETE"}
              style={[
                globalStyles.button,
                {
                  marginTop: 10,
                  backgroundColor:
                    confirmText === "DELETE"
                      ? COLORS.accent
                      : "#ccc",
                },
              ]}
              onPress={eliminar}
            >
              <Text style={globalStyles.buttonText}>
                Confirmar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedId(null);
                setConfirmText("");
              }}
              style={{ marginTop: 12, alignItems: "center" }}
            >
              <Text style={{ color: COLORS.secondary }}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}
