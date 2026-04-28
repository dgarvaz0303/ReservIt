import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";

import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

export default function DetalleReserva() {
  const params = useLocalSearchParams();

  const reservaId = Array.isArray(params.reservaId)
    ? params.reservaId[0]
    : params.reservaId;
  const router = useRouter();

  const [reserva, setReserva] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const [validacionEstado, setValidacionEstado] = useState<
    "ok" | "error" | null
  >(null);

  const animScale = useState(new Animated.Value(0))[0];
  const animOpacity = useState(new Animated.Value(0))[0];
  const animLaser = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchReserva();
  }, []);

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
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />

        {/* MARCO PRO */}
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

          <Text style={styles.scanText}>
            Escanea el código QR
          </Text>
        </View>

        {/* BOTONES */}
        <View style={styles.scannerOverlay}>
          {scanned && (
            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => setScanned(false)}
            >
              <Text style={globalStyles.buttonText}>
                Escanear otra vez
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

        {/* VALIDACION */}
        {validacionEstado && (
          <View
            style={[
              styles.validationOverlay,
              {
                backgroundColor:
                  validacionEstado === "ok"
                    ? "#4CAF50"
                    : "#e53935",
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.validationIcon,
                {
                  transform: [{ scale: animScale }],
                  opacity: animOpacity,
                },
              ]}
            >
              {validacionEstado === "ok" ? "✔" : "✖"}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.validationText,
                { opacity: animOpacity },
              ]}
            >
              {validacionEstado === "ok"
                ? "Reserva validada"
                : "QR inválido"}
            </Animated.Text>
          </View>
        )}
      </View>
    );
  }

  // ================= NORMAL =================
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Detalle reserva</Text>

      <View style={globalStyles.card}>
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

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  scanBox: { width: 250, height: 250 },

  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "white",
  },

  topLeft: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3 },
  topRight: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 3, borderBottomWidth: 3 },

  laser: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },

  scanText: { color: "white", marginTop: 20 },

  scannerOverlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    padding: 20,
  },

  validationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  validationIcon: { fontSize: 80, color: "white" },

  validationText: { fontSize: 18, color: "white", marginTop: 10 },

  badge: { marginTop: 10, padding: 6, borderRadius: 10 },

  badgeActive: { backgroundColor: "#e8f5e9", color: "green" },

  badgeUsed: { backgroundColor: "#eee" },

  deleteBtn: { backgroundColor: COLORS.accent },

  cancelBtn: { backgroundColor: "#666" },
});