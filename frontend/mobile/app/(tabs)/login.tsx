import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../../themes/styles";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

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

      router.replace("/");

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>

        <Text style={globalStyles.title}>Bienvenido</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* BOTÓN LOGIN */}
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleLogin}
        >
          <Text style={globalStyles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* LINK REGISTER */}
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={globalStyles.link}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>

        {/* ERROR */}
        {error ? <Text style={globalStyles.error}>{error}</Text> : null}

      </View>
    </View>
  );
}