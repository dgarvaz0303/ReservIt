import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

/* ===== TYPES ===== */
interface Reserva {
  id: number;
  nombre_usuario: string;
  num_personas: number;
  establecimiento_nombre: string;
  zona: string;
  fecha: string;
  hora: string;
  imagen_url?: string;
  qr_token: string;
}

export default function DetalleReserva() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { id } = route.params;

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchReserva();
  }, []);

  const fetchReserva = async () => {
    try {
      const res = await fetch(`http://192.168.1.132:8000/api/reservas/${id}`);
      const data = await res.json();

      if (data.detail) {
        Alert.alert("Error", data.detail);
        navigation.goBack();
        return;
      }

      setReserva(data);
    } catch (err) {
      console.log(err);
    }
  };

  const eliminar = async () => {
    await fetch(`http://192.168.1.132:8000/api/reservas/${id}`, {
      method: "DELETE",
    });

    setShowConfirm(false);
    navigation.navigate("MisReservas");
  };

  if (!reserva) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={globalStyles.title}>Reserva</Text>

        <TouchableOpacity style={styles.outlineBtn}>
          <Text style={{ color: COLORS.primary }}>PDF</Text>
        </TouchableOpacity>
      </View>

      {/* QR */}
      <View style={globalStyles.card}>
        <Image
          source={{
            uri: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${reserva.qr_token}`,
          }}
          style={styles.qr}
        />
        <Text style={styles.qrText}>
          Presenta este código en el local
        </Text>
      </View>

      {/* INFO */}
      <View style={globalStyles.card}>

        <Image
          source={{
            uri: reserva.imagen_url || "https://via.placeholder.com/300",
          }}
          style={styles.image}
        />

        <Text style={styles.estTitle}>
          {reserva.establecimiento_nombre}
        </Text>

        <Text style={styles.info}>Cliente: {reserva.nombre_usuario}</Text>
        <Text style={styles.info}>Personas: {reserva.num_personas}</Text>
        <Text style={styles.info}>Zona: {reserva.zona}</Text>
        <Text style={styles.info}>Fecha: {reserva.fecha}</Text>
        <Text style={styles.info}>Hora: {reserva.hora}</Text>

      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>

        <TouchableOpacity style={globalStyles.button} disabled>
          <Text style={globalStyles.buttonText}>Próximamente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={{ color: COLORS.primary }}>Eliminar</Text>
        </TouchableOpacity>

      </View>

      {/* MODAL */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>

          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              ¿Eliminar reserva?
            </Text>

            <Text style={styles.modalText}>
              Escribe DELETE para confirmar
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              style={globalStyles.input}
              placeholder="DELETE"
            />

            <View style={styles.modalBtns}>

              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  setConfirmText("");
                }}
              >
                <Text style={{ color: COLORS.secondary }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={confirmText !== "DELETE"}
                onPress={eliminar}
              >
                <Text
                  style={{
                    color:
                      confirmText === "DELETE"
                        ? COLORS.accent
                        : "#aaa",
                  }}
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

/* ===== SOLO LO ESPECÍFICO ===== */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  qr: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },

  qrText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  estTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },

  info: {
    color: COLORS.text,
    marginBottom: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  outlineBtn: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    width: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },

  modalText: {
    color: COLORS.text,
    marginBottom: 10,
  },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});