import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { globalStyles } from "../../../themes/styles";
import { COLORS } from "../../../themes/colors";

export default function EditarPerfilScreen() {
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    nombre: "",
    nombre_user: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
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

      setForm({
        nombre: data.nombre || "",
        nombre_user: data.nombre_user || "",
        telefono: data.telefono || "",
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const guardar = async () => {
    try {
      setSaving(true);

      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        "http://192.168.1.132:8000/api/usuarios/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.detail || "Error al guardar");
        return;
      }

      Alert.alert("Éxito", "Perfil actualizado");

      navigation.goBack();

    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>

      {/* HEADER */}
      <Text style={globalStyles.title}>
        Editar perfil
      </Text>

      {/* FORM */}
      <View style={globalStyles.card}>

        <Text style={globalStyles.sectionTitle}>Nombre</Text>
        <TextInput
          value={form.nombre}
          onChangeText={(v) => handleChange("nombre", v)}
          style={globalStyles.input}
          placeholder="Tu nombre"
        />

        <Text style={globalStyles.sectionTitle}>
          Nombre de usuario
        </Text>
        <TextInput
          value={form.nombre_user}
          onChangeText={(v) => handleChange("nombre_user", v)}
          style={globalStyles.input}
          placeholder="@usuario"
        />

        <Text style={globalStyles.sectionTitle}>
          Teléfono
        </Text>
        <TextInput
          value={form.telefono}
          onChangeText={(v) => handleChange("telefono", v)}
          style={globalStyles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
        />

        {/* BOTÓN */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            saving && { backgroundColor: "#aaa" },
          ]}
          disabled={saving}
          onPress={guardar}
        >
          <Text style={globalStyles.buttonText}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Text>
        </TouchableOpacity>

      </View>

      {/* VOLVER */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={globalStyles.link}>
          ← Volver
        </Text>
      </TouchableOpacity>

    </View>
  );
}