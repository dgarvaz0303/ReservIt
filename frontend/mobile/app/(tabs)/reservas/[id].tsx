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
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { globalStyles } from "@/themes/styles";
import { detalleReservaStyles as styles } from "@/themes/detaleReservaStyles";
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
      const res = await fetch(`https://reservit.onrender.com/api/reservas/${id}`);
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
    await fetch(`https://reservit.onrender.com/api/reservas/${id}`, {
      method: "DELETE",
    });

    setShowConfirm(false);
    router.push("/reservas");
  };

  const generarPDF = async () => {
    if (!reserva) return;

    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h2>${reserva.establecimiento_nombre}</h2>
          <p>${reserva.nombre_usuario}</p>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  if (!reserva) {
    return (
      <View style={globalStyles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.scroll}
      contentContainerStyle={styles.scrollContent}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/reservas")}
        >
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={globalStyles.title}>Reserva</Text>

        <TouchableOpacity style={styles.outlineBtn} onPress={generarPDF}>
          <Text style={styles.outlineText}>PDF</Text>
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
          <Text style={styles.outlineText}>Eliminar</Text>
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