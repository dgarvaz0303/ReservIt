import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

export default function DetalleEstablecimientoSupervisor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [establecimiento, setEstablecimiento] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchEstablecimiento();
  }, []);

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

      router.replace("/main/mis-establecimientos");
    } catch (err) {
      console.log(err);
    }
  };

  if (!establecimiento) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>

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
        <Text style={globalStyles.title}>
          {establecimiento.nombre}
        </Text>

        <Text style={styles.info}>
          Tipo: {establecimiento.tipo}
        </Text>

        <Text style={styles.info}>
          Dirección: {establecimiento.direccion}
        </Text>

        <Text style={styles.info}>
          Teléfono: {establecimiento.telefono}
        </Text>

        <Text style={styles.info}>
          Capacidad: {establecimiento.capacidad}
        </Text>
      </View>

      {/* ACCIONES */}
      <View style={styles.actions}>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={() =>
            router.push(`/main/mis-establecimientos/${id}/reservas`)
          }
        >
          <Text style={globalStyles.buttonText}>
            Ver reservas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, styles.dangerBtn]}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={globalStyles.buttonText}>
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
              style={globalStyles.input}
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

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },

  info: {
    color: COLORS.text,
    marginTop: 6,
  },

  actions: {
    marginTop: 20,
    gap: 12,
  },

  dangerBtn: {
    backgroundColor: COLORS.accent,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
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

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancel: {
    color: COLORS.secondary,
  },

  confirm: {
    color: COLORS.accent,
    fontWeight: "600",
  },
});