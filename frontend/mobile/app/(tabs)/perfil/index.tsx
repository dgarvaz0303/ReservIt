"use client";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { globalStyles } from "../../../themes/styles";
import { COLORS } from "../../../themes/colors";
import { perfilStyles as styles } from "../../../themes/perfilStyles";

export default function PerfilScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [historial, setHistorial] = useState<any[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useFocusEffect(
  useCallback(() => {
    fetchPerfil();
    fetchHistorial();
  }, [])
);

  const fetchPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        "http://192.168.1.132:8000/api/usuarios/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHistorial = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(
      "http://192.168.1.132:8000/api/reservas/mis",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const raw = await res.json();
    const data = Array.isArray(raw) ? raw : raw.data || [];

    const pasadas = data.filter(
      (r: any) =>
        new Date(`${r.fecha} ${r.hora}`) < new Date()
    );

    setHistorial(pasadas);
  };

  const eliminarCuenta = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(
        "http://192.168.1.132:8000/api/usuarios/me",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await AsyncStorage.clear();

      Alert.alert("Cuenta eliminada");
      router.replace("/login");

    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>

      {/* BOTÓN VOLVER */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.backText}>← Inicio</Text>
      </TouchableOpacity>

      {/* INFO */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>{user.nombre}</Text>

        <Text style={globalStyles.cardText}>
          @{user.nombre_user}
        </Text>

        <Text style={globalStyles.cardText}>
          {user.email}
        </Text>

        <Text style={globalStyles.cardText}>
          {user.telefono}
        </Text>
      </View>

      {/* HISTORIAL */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>
          Historial
        </Text>

        <FlatList
          horizontal
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.historialItem}>

              <Image
                source={{
                  uri:
                    item.imagen_url ||
                    "https://via.placeholder.com/300",
                }}
                style={styles.historialImage}
              />

              <Text style={globalStyles.cardTitle}>
                {item.establecimiento_nombre}
              </Text>

              <Text style={globalStyles.cardText}>
                {item.fecha}
              </Text>

            </View>
          )}
        />
      </View>

      {/* BOTONES */}
      <View style={globalStyles.card}>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={() =>
            router.push("/perfil/editar")
          }
        >
          <Text style={globalStyles.buttonText}>
            Editar perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.button,
            { backgroundColor: COLORS.accent },
          ]}
          onPress={() => setShowDelete(true)}
        >
          <Text style={globalStyles.buttonText}>
            Eliminar cuenta
          </Text>
        </TouchableOpacity>

      </View>

      {/* MODAL */}
      <Modal visible={showDelete} transparent animationType="fade">
        <View style={styles.modalOverlay}>

          <View style={globalStyles.card}>

            <Text style={globalStyles.sectionTitle}>
              Confirmar eliminación
            </Text>

            <Text style={globalStyles.text}>
              Escribe DELETE para continuar
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              style={globalStyles.input}
              placeholder="DELETE"
            />

            <TouchableOpacity
              disabled={confirmText !== "DELETE"}
              style={[
                globalStyles.button,
                {
                  backgroundColor:
                    confirmText === "DELETE"
                      ? COLORS.accent
                      : "#aaa",
                },
              ]}
              onPress={eliminarCuenta}
            >
              <Text style={globalStyles.buttonText}>
                Confirmar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDelete(false)}
            >
              <Text style={globalStyles.link}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}