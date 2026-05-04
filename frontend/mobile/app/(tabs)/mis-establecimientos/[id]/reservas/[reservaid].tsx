"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";

import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import { globalStyles } from "@/themes/styles";
import { detalleReservaStyles as styles } from "@/themes/detalleReservaLocalesStyles";

export default function DetalleReserva() {
  const params = useLocalSearchParams();

  const reservaId = Array.isArray(params.reservaid)
    ? params.reservaid[0]
    : params.reservaid;

  const router = useRouter();

  const [reserva, setReserva] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const establecimientoId = Array.isArray(params.id)
  ? params.id[0]
  : params.id;
  const [validacionEstado, setValidacionEstado] = useState<
    "ok" | "error" | null
  >(null);

  const animScale = useState(new Animated.Value(0))[0];
  const animOpacity = useState(new Animated.Value(0))[0];
  const animLaser = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchReserva();
  }, [reservaId]);

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.timing(animLaser, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [scanning]);

  const fetchReserva = async () => {
    if (!reservaId) return;

    const res = await fetch(
      `http://192.168.1.132:8000/api/reservas/${reservaId}`
    );
    const data = await res.json();
    setReserva(data);
  };

  const playSound = async (tipo: "ok" | "error") => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        tipo === "ok"
          ? require("@/assets/sounds/success.mp3")
          : require("@/assets/sounds/error.mp3")
      );
      await sound.playAsync();
    } catch {}
  };

  const lanzarAnimacion = async (tipo: "ok" | "error") => {
    setValidacionEstado(tipo);

    Haptics.notificationAsync(
      tipo === "ok"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );

    playSound(tipo);

    animScale.setValue(0.5);
    animOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(animScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setValidacionEstado(null);
        setScanning(false);
        setScanned(false);
      }, 1500);
    });
  };

  const validarQR = async (qr_token: string) => {
    try {
      const res = await fetch(
        `http://192.168.1.132:8000/api/reservas/usar/${qr_token}`,
        { method: "POST" }
      );

      if (res.ok) lanzarAnimacion("ok");
      else lanzarAnimacion("error");

      fetchReserva();
    } catch {
      lanzarAnimacion("error");
    }
  };

  const handleScan = ({ data }: any) => {
    if (scanned) return;
    setScanned(true);
    validarQR(data);
  };

  const eliminarReserva = async () => {
    const token = await AsyncStorage.getItem("token");

    await fetch(
      `http://192.168.1.132:8000/api/reservas/${reservaId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Alert.alert("Reserva eliminada");
    router.back();
  };

  if (!reserva) {
    return (
      <View style={globalStyles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  // ================= SCANNER =================
  if (scanning) {
    if (!permission) return <Text>Solicitando permiso...</Text>;

    if (!permission.granted) {
      return (
        <View style={styles.center}>
          <Text>No hay acceso a cámara</Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text>Permitir</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />

        <View style={styles.cameraOverlay}>
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <Animated.View
              style={[
                styles.laser,
                {
                  transform: [
                    {
                      translateY: animLaser.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 200],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          <Text style={styles.scanText}>Escanea el QR</Text>
        </View>

        <View style={styles.scannerButtons}>
          {scanned && (
            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => setScanned(false)}
            >
              <Text style={globalStyles.buttonText}>
                Reintentar
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[globalStyles.button, styles.cancelBtn]}
            onPress={() => setScanning(false)}
          >
            <Text style={globalStyles.buttonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>

        {validacionEstado && (
          <View
            style={[
              styles.validationOverlay,
              validacionEstado === "ok"
                ? styles.ok
                : styles.error,
            ]}
          >
            <Animated.Text
              style={[
                styles.validationIcon,
                { transform: [{ scale: animScale }] },
              ]}
            >
              {validacionEstado === "ok" ? "✔" : "✖"}
            </Animated.Text>

            <Text style={styles.validationText}>
              {validacionEstado === "ok"
                ? "Reserva validada"
                : "QR inválido"}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ================= NORMAL =================
  return (
    <View style={globalStyles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() =>
          router.push(`/mis-establecimientos/${establecimientoId}/reservas`)
        }
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={globalStyles.title}>Detalle reserva</Text>

      <View style={styles.card}>
        <Text>📅 {reserva.fecha} - {reserva.hora}</Text>
        <Text>👥 {reserva.num_personas}</Text>
        <Text>👤 {reserva.nombre_usuario}</Text>
        <Text>📍 {reserva.establecimiento_nombre}</Text>
        <Text>Zona: {reserva.zona}</Text>

        <Text
          style={[
            styles.badge,
            reserva.qr_usado
              ? styles.badgeUsed
              : styles.badgeActive,
          ]}
        >
          {reserva.qr_usado ? "Usado" : "Pendiente"}
        </Text>
      </View>

      {!reserva.qr_usado && (
        <TouchableOpacity
          style={globalStyles.button}
          onPress={async () => {
            await requestPermission();
            setScanning(true);
          }}
        >
          <Text style={globalStyles.buttonText}>
            Escanear QR
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[globalStyles.button, styles.deleteBtn]}
        onPress={eliminarReserva}
      >
        <Text style={globalStyles.buttonText}>
          Eliminar reserva
        </Text>
      </TouchableOpacity>
    </View>
  );
}