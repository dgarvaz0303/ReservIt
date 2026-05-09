import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from "react-native";

import { router } from "expo-router";

import { globalStyles } from "../../themes/styles";
import { registerStyles } from "../../themes/registerStyles";

export default function Register() {

  const [form, setForm] = useState({
    nombre: "",
    nombre_user: "",
    email: "",
    telefono: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUTS
  // =========================

  const handleChange = (
    name: string,
    value: string
  ) => {

    setForm({
      ...form,
      [name]: value,
    });
  };

  // =========================
  // VALIDACIONES
  // =========================

  const validarEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarTelefono = (telefono: string) => {
    return /^[0-9]{9,15}$/.test(telefono);
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async () => {

    setError("");
    setSuccess("");

    const nombre = form.nombre.trim();
    const nombreUser = form.nombre_user.trim();
    const email = form.email.trim();
    const telefono = form.telefono.trim();
    const password = form.password.trim();

    // CAMPOS VACÍOS
    if (
      !nombre ||
      !nombreUser ||
      !email ||
      !telefono ||
      !password
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // NOMBRE
    if (nombre.length < 3) {
      setError(
        "El nombre debe tener al menos 3 caracteres"
      );
      return;
    }

    // USER
    if (nombreUser.length < 3) {
      setError(
        "El nombre de usuario es demasiado corto"
      );
      return;
    }

    // EMAIL
    if (!validarEmail(email)) {
      setError("Introduce un email válido");
      return;
    }

    // TELÉFONO
    if (!validarTelefono(telefono)) {
      setError("Introduce un teléfono válido");
      return;
    }

    // PASSWORD
    if (password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "https://reservit.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            nombre_user: nombreUser,
            email,
            telefono,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        let mensaje = "Error en registro";

        if (typeof data.detail === "string") {

          mensaje = data.detail;

        } else if (Array.isArray(data.detail)) {

          mensaje = data.detail
            .map((e: any) => e.msg)
            .join(", ");

        } else if (
          typeof data.detail === "object" &&
          data.detail !== null
        ) {

          mensaje =
            data.detail.msg ||
            JSON.stringify(data.detail);
        }

        throw new Error(mensaje);
      }

      setSuccess("Usuario creado correctamente");

      setTimeout(() => {
        router.replace("/login");
      }, 1200);

    } catch (err: any) {

      setError(
        typeof err?.message === "string"
          ? err.message
          : "Error inesperado"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center"
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.card}>

          {/* LOGO */}
          <Image
            source={{
              uri: "https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
            }}
            style={registerStyles.logo}
            resizeMode="contain"
          />

          {/* TITULO */}
          <Text style={globalStyles.title}>
            Crear cuenta
          </Text>

          <Text style={registerStyles.subtitle}>
            Completa tus datos para empezar
          </Text>

          {/* NOMBRE + USER */}
          <View style={registerStyles.row}>

            <TextInput
              style={[
                globalStyles.input,
                registerStyles.halfInput
              ]}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={form.nombre}
              onChangeText={(v) =>
                handleChange("nombre", v)
              }
              maxLength={60}
            />

            <TextInput
              style={[
                globalStyles.input,
                registerStyles.halfInput
              ]}
              placeholder="Usuario"
              placeholderTextColor="#999"
              value={form.nombre_user}
              onChangeText={(v) =>
                handleChange("nombre_user", v)
              }
              autoCapitalize="none"
              maxLength={30}
            />

          </View>

          {/* EMAIL */}
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(v) =>
              handleChange("email", v)
            }
            maxLength={120}
          />

          {/* TELÉFONO */}
          <TextInput
            style={globalStyles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(v) =>
              handleChange("telefono", v)
            }
            maxLength={15}
          />

          {/* PASSWORD */}
          <TextInput
            style={globalStyles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={form.password}
            onChangeText={(v) =>
              handleChange("password", v)
            }
            maxLength={60}
          />

          {/* BOTÓN */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              loading && { opacity: 0.7 }
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.buttonText}>
                Registrarse
              </Text>
            )}
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <TouchableOpacity
            style={registerStyles.footerSpace}
            onPress={() => router.push("/login")}
          >
            <Text style={globalStyles.link}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>

          {/* ERROR */}
          {error ? (
            <Text style={globalStyles.error}>
              {error}
            </Text>
          ) : null}

          {/* SUCCESS */}
          {success ? (
            <Text style={globalStyles.success}>
              {success}
            </Text>
          ) : null}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}