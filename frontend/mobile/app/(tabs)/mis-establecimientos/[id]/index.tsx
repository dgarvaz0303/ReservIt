"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { globalStyles } from "@/themes/styles";
import { detalleSupervisorStyles as styles } from "@/themes/detalleSupervisorStyles";

export default function DetalleEstablecimientoSupervisor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [establecimiento, setEstablecimiento] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (id) {
      fetchEstablecimiento();
    }
  }, [id]);

  const fetchEstablecimiento = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.132:8000/api/establecimientos/${id}`
      );
      const data = await res.json();
      setEstablecimiento(data.data || data);
    } catch (err) {
      console.log(err);
    }
  };

  const eliminar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(
        `http://192.168.1.132:8000/api/establecimientos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.replace("/mis-establecimientos");
    } catch (err) {
      console.log(err);
    }
  };

  if (!establecimiento) {
    return (
      <View style={globalStyles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.scroll}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/mis-establecimientos")}
        >
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGEN */}
      <Image
        source={{
          uri:
            establecimiento.imagen_url ||
            "https://via.placeholder.com/300",
        }}
        style={styles.image}
      />

      {/* INFO */}
      <View style={globalStyles.card}>
        <Text style={styles.title}>
          {establecimiento.nombre}
        </Text>

        <Text style={styles.info}>
          Direccion: {establecimiento.direccion}
        </Text>

        <Text style={styles.info}>
          Tipo Establecimiento: {establecimiento.tipo}
        </Text>

        <Text style={styles.info}>
          Telefono: {establecimiento.telefono}
        </Text>

      </View>

      {/* ACCIONES */}
      <View style={styles.actions}>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            router.push(`/mis-establecimientos/${id}/reservas`)
          }
        >
          <Text style={styles.primaryText}>
            Ver reservas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={styles.deleteText}>
            Eliminar establecimiento
          </Text>
        </TouchableOpacity>

      </View>

      {/* MODAL */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>

          <View style={styles.modal}>

            <Text style={styles.modalTitle}>
              ¿Eliminar establecimiento?
            </Text>

            <Text style={styles.modalText}>
              Escribe DELETE para confirmar
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="DELETE"
              style={styles.input}
              placeholderTextColor="#888"
            />

            <View style={styles.modalActions}>

              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  setConfirmText("");
                }}
              >
                <Text style={styles.cancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={confirmText !== "DELETE"}
                onPress={eliminar}
              >
                <Text
                  style={[
                    styles.confirm,
                    confirmText !== "DELETE" && { opacity: 0.4 },
                  ]}
                >
                  Confirmar
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}