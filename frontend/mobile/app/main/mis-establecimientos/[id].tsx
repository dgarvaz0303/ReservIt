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
    const res = await fetch(
      `http://192.168.1.132:8000/api/establecimientos/${id}`
    );
    const data = await res.json();
    setEstablecimiento(data.data || data);
  };

  const eliminar = async () => {
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

    router.replace("/(tabs)/establecimientos");
  };

  if (!establecimiento)
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>Cargando...</Text>
      </View>
    );

  return (
    <ScrollView style={globalStyles.container}>

      {/* IMAGEN */}
      <Image
        source={{
          uri:
            establecimiento.imagen_url ||
            "https://via.placeholder.com/300",
        }}
        style={{
          width: "100%",
          height: 220,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      {/* INFO */}
      <View style={globalStyles.card}>

        <Text style={globalStyles.title}>
          {establecimiento.nombre}
        </Text>

        <Text style={globalStyles.cardText}>
          Tipo: {establecimiento.tipo}
        </Text>

        <Text style={globalStyles.cardText}>
          Dirección: {establecimiento.direccion}
        </Text>

        <Text style={globalStyles.cardText}>
          Teléfono: {establecimiento.telefono}
        </Text>

        <Text style={globalStyles.cardText}>
          Capacidad: {establecimiento.capacidad}
        </Text>

      </View>

      {/* ACCIONES */}
      <View style={{ marginTop: 20 }}>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={() =>
            router.push(`/establecimientos/editar/${id}`)
          }
        >
          <Text style={globalStyles.buttonText}>
            Editar establecimiento
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.buttonSecondary}
          onPress={() =>
            router.push(`/establecimientos/${id}/reservas`)
          }
        >
          <Text style={globalStyles.buttonSecondaryText}>
            Ver reservas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.button,
            { backgroundColor: COLORS.accent },
          ]}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={globalStyles.buttonText}>
            Eliminar establecimiento
          </Text>
        </TouchableOpacity>

      </View>

      {/* MODAL */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={globalStyles.card}>

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
                  backgroundColor:
                    confirmText === "DELETE"
                      ? COLORS.accent
                      : "#ccc",
                },
              ]}
              onPress={eliminar}
            >
              <Text style={globalStyles.buttonText}>
                Confirmar eliminación
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowConfirm(false);
                setConfirmText("");
              }}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: COLORS.secondary }}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}