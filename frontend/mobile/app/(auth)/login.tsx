import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { globalStyles } from "../../themes/styles";
import { loginStyles } from "../../themes/loginStyles";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // VALIDACIONES
  // =========================

  const validarEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {

    setError("");

    const emailLimpio = email.trim();
    const passwordLimpia = password.trim();

    // CAMPOS VACÍOS
    if (!emailLimpio || !passwordLimpia) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // EMAIL
    if (!validarEmail(emailLimpio)) {
      setError("Introduce un email válido");
      return;
    }

    // PASSWORD
    if (passwordLimpia.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "http://192.168.1.132:8000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailLimpio,
            password: passwordLimpia,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

          let mensaje = "Error en login";

          if (typeof data.detail === "string") {
            mensaje = data.detail;

          } else if (Array.isArray(data.detail)) {

            mensaje = data.detail
              .map((e: any) => e.msg)
              .join(", ");

          } else if (typeof data.detail === "object" && data.detail !== null) {

            mensaje =
              data.detail.msg ||
              JSON.stringify(data.detail);

          }

          throw new Error(mensaje);
        }

      // TOKEN
      await AsyncStorage.setItem(
        "token",
        data.access_token
      );

      await AsyncStorage.setItem(
        "nombre",
        data.nombre || emailLimpio
      );

      await AsyncStorage.setItem(
        "rol",
        data.rol || "cliente"
      );

      router.replace("/");

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
      <View style={globalStyles.card}>

        {/* LOGO */}
        <Image
          source={{
            uri: "https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png",
          }}
          style={loginStyles.logo}
          resizeMode="contain"
        />

        {/* TÍTULO */}
        <Text style={globalStyles.title}>
          Bienvenido
        </Text>

        {/* SUBTÍTULO */}
        <Text style={loginStyles.subtitle}>
          Accede a tu cuenta para continuar
        </Text>

        {/* EMAIL */}
        <TextInput
          style={globalStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={120}
        />

        {/* PASSWORD */}
        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          maxLength={60}
        />

        {/* BOTÓN */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            loading && { opacity: 0.7 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>
              Iniciar sesión
            </Text>
          )}
        </TouchableOpacity>

        {/* REGISTER */}
        <TouchableOpacity
          onPress={() =>
            router.push("/register")
          }
        >
          <Text style={globalStyles.link}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>

        {/* ERROR */}
        {error ? (
          <Text style={globalStyles.error}>
            {error}
          </Text>
        ) : null}

      </View>
    </KeyboardAvoidingView>
  );
}