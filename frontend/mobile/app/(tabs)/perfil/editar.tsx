"use client";

import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { globalStyles } from "../../../themes/styles";
import { editarPerfilStyles as styles } from "../../../themes/editarPerfilStyles";

export default function EditarPerfilScreen() {

  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    nombre_user: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {
    fetchPerfil();
  }, []);

  // =========================
  // VALIDACIONES
  // =========================

  const validarTelefono = (
    telefono: string
  ) => {

    return /^[0-9]{9,15}$/.test(
      telefono
    );
  };

  // =========================
  // FETCH PERFIL
  // =========================

  const fetchPerfil = async () => {

    try {

      const token =
        await AsyncStorage.getItem(
          "token"
        );

      const res = await fetch(
        "https://reservit.onrender.com/api/usuarios/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setForm({
        nombre: data.nombre || "",
        nombre_user:
          data.nombre_user || "",
        telefono:
          data.telefono || "",
      });

    } catch (err) {

      console.log(err);

      Alert.alert(
        "Error",
        "No se pudo cargar el perfil"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (
    field: string,
    value: string
  ) => {

    setForm({
      ...form,
      [field]: value,
    });
  };

  // =========================
  // GUARDAR
  // =========================

  const guardar = async () => {

    try {

      setSaving(true);

      // =========================
      // LIMPIAR
      // =========================

      const nombre =
        form.nombre.trim();

      const nombreUser =
        form.nombre_user.trim();

      const telefono =
        form.telefono.trim();

      // =========================
      // VALIDACIONES
      // =========================

      // CAMPOS VACÍOS

      if (
        !nombre ||
        !nombreUser ||
        !telefono
      ) {

        Alert.alert(
          "Campos obligatorios",
          "Todos los campos son obligatorios"
        );

        return;
      }

      // NOMBRE

      if (nombre.length < 3) {

        Alert.alert(
          "Nombre inválido",
          "El nombre debe tener al menos 3 caracteres"
        );

        return;
      }

      // USER

      if (nombreUser.length < 3) {

        Alert.alert(
          "Usuario inválido",
          "El nombre de usuario es demasiado corto"
        );

        return;
      }

      // TELÉFONO

      if (
        !validarTelefono(telefono)
      ) {

        Alert.alert(
          "Teléfono inválido",
          "Introduce un teléfono válido"
        );

        return;
      }

      // =========================
      // TOKEN
      // =========================

      const token =
        await AsyncStorage.getItem(
          "token"
        );

      if (!token) {

        Alert.alert(
          "Sesión expirada",
          "Debes iniciar sesión"
        );

        return;
      }

      // =========================
      // REQUEST
      // =========================

      const res = await fetch(
        "https://reservit.onrender.com/api/usuarios/me",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre,
            nombre_user:
              nombreUser,
            telefono,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        let mensaje =
          "Error al guardar";

        if (
          typeof data.detail ===
          "string"
        ) {

          mensaje =
            data.detail;

        } else if (
          Array.isArray(data.detail)
        ) {

          mensaje =
            data.detail
              .map(
                (e: any) => e.msg
              )
              .join(", ");

        } else if (
          typeof data.detail ===
            "object" &&
          data.detail !== null
        ) {

          mensaje =
            data.detail.msg ||
            JSON.stringify(
              data.detail
            );
        }

        Alert.alert(
          "Error",
          mensaje
        );

        return;
      }

      Alert.alert(
        "Correcto",
        "Perfil actualizado"
      );

      router.replace("/perfil");

    } catch (err: any) {

      Alert.alert(
        "Error",
        err?.message ||
          "Error inesperado"
      );

    } finally {

      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <View
        style={
          globalStyles.container
        }
      >
        <Text
          style={globalStyles.text}
        >
          Cargando...
        </Text>
      </View>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <View
      style={
        globalStyles.container
      }
    >

      {/* VOLVER */}

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() =>
          router.push("/perfil")
        }
      >
        <Text style={styles.backText}>
          ← Volver
        </Text>
      </TouchableOpacity>

      {/* HEADER */}

      <Text style={globalStyles.title}>
        Editar perfil
      </Text>

      {/* FORM */}

      <View style={globalStyles.card}>

        {/* NOMBRE */}

        <Text style={styles.label}>
          Nombre
        </Text>

        <TextInput
          value={form.nombre}
          onChangeText={(v) =>
            handleChange(
              "nombre",
              v
            )
          }
          style={globalStyles.input}
          placeholder="Tu nombre"
          maxLength={60}
        />

        {/* USER */}

        <Text style={styles.label}>
          Nombre de usuario
        </Text>

        <TextInput
          value={form.nombre_user}
          onChangeText={(v) =>
            handleChange(
              "nombre_user",
              v
            )
          }
          style={globalStyles.input}
          placeholder="@usuario"
          autoCapitalize="none"
          maxLength={30}
        />

        {/* TELÉFONO */}

        <Text style={styles.label}>
          Teléfono
        </Text>

        <TextInput
          value={form.telefono}
          onChangeText={(v) =>
            handleChange(
              "telefono",
              v
            )
          }
          style={globalStyles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          maxLength={15}
        />

        {/* BOTÓN */}

        <TouchableOpacity
          style={[
            globalStyles.button,
            saving &&
              styles.disabledBtn,
          ]}
          disabled={saving}
          onPress={guardar}
        >
          <Text
            style={
              globalStyles.buttonText
            }
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}