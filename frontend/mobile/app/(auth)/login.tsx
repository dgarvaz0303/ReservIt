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

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.132:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error en login");
      }

      await AsyncStorage.setItem("token", data.access_token);
      await AsyncStorage.setItem("nombre", data.nombre || email);
      await AsyncStorage.setItem("rol", data.rol || "cliente");

      router.replace("/");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={globalStyles.card}>

        {/* LOGO */}
        <Image
          src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
          style={loginStyles.logo}
          resizeMode="contain"
        />

        {/* TÍTULO */}
        <Text style={globalStyles.title}>Bienvenido</Text>

        {/* SUBTÍTULO */}
        <Text style={loginStyles.subtitle}>
          Accede a tu cuenta para continuar
        </Text>

        {/* EMAIL */}
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* PASSWORD */}
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={globalStyles.link}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>

        {/* ERROR */}
        {error ? (
          <Text style={globalStyles.error}>{error}</Text>
        ) : null}

      </View>
    </KeyboardAvoidingView>
  );
}