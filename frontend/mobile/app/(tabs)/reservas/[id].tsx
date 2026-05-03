"use client";

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
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

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
        router.push("/reservas");
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
    router.push("/reservas");
  };

  // =========================
  // PDF GENERADOR
  // =========================
  const generarPDF = async () => {
    if (!reserva) return;

    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px; background:#FAF9F6;">

          <!-- HEADER -->
          <div style="background:#6F4E37; color:white; padding:15px; border-radius:12px;">
            <h2 style="margin:0;">ReservIt</h2>
            <p style="margin:0;">Detalle de la reserva</p>
          </div>

          <!-- CARD -->
          <div style="margin-top:20px; padding:15px; background:white; border-radius:12px;">

            <h3 style="color:#6F4E37;">${reserva.establecimiento_nombre}</h3>

            <p><strong>Cliente:</strong> ${reserva.nombre_usuario}</p>
            <p><strong>Personas:</strong> ${reserva.num_personas}</p>
            <p><strong>Zona:</strong> ${reserva.zona}</p>
            <p><strong>Fecha:</strong> ${reserva.fecha}</p>
            <p><strong>Hora:</strong> ${reserva.hora}</p>

          </div>

          <!-- QR -->
          <div style="text-align:center; margin-top:30px;">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${reserva.qr_token}" 
            />
            <p style="color:#666;">Presenta este código en el local</p>
          </div>

          <!-- FOOTER -->
          <p style="text-align:center; margin-top:30px; font-size:12px; color:#aaa;">
            Generado por ReservIt
          </p>

        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo generar el PDF");
    }
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

        <TouchableOpacity style={styles.outlineBtn} onPress={generarPDF}>
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

/* ===== STYLES ===== */
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