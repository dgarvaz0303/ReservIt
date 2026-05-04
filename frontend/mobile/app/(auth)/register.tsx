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

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.132:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error en registro");
      }

      setSuccess("Usuario creado correctamente");

      setTimeout(() => {
        router.replace("/login");
      }, 1000);

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
            src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
            style={registerStyles.logo}
            resizeMode="contain"
          />

          {/* TITULO */}
          <Text style={globalStyles.title}>Crear cuenta</Text>

          <Text style={registerStyles.subtitle}>
            Completa tus datos para empezar
          </Text>

          {/* NOMBRE + USER */}
          <View style={registerStyles.row}>
            <TextInput
              style={[globalStyles.input, registerStyles.halfInput]}
              placeholder="Nombre"
              placeholderTextColor="#999"
              onChangeText={(v) => handleChange("nombre", v)}
            />

            <TextInput
              style={[globalStyles.input, registerStyles.halfInput]}
              placeholder="Usuario"
              placeholderTextColor="#999"
              onChangeText={(v) => handleChange("nombre_user", v)}
            />
          </View>

          {/* EMAIL */}
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(v) => handleChange("email", v)}
          />

          {/* TELÉFONO */}
          <TextInput
            style={globalStyles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("telefono", v)}
          />

          {/* PASSWORD */}
          <TextInput
            style={globalStyles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={(v) => handleChange("password", v)}
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

          {error ? <Text style={globalStyles.error}>{error}</Text> : null}
          {success ? <Text style={globalStyles.success}>{success}</Text> : null}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}