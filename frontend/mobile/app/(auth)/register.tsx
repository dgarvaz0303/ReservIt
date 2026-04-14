import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { globalStyles } from "../../themes/styles";



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

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

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

      setSuccess("Usuario creado");
      router.replace("/login");

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>

        <Text style={globalStyles.title}>Crear cuenta</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Nombre"
          onChangeText={(v) => handleChange("nombre", v)}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Usuario"
          onChangeText={(v) => handleChange("nombre_user", v)}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          onChangeText={(v) => handleChange("email", v)}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Teléfono"
          onChangeText={(v) => handleChange("telefono", v)}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(v) => handleChange("password", v)}
        />

        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleRegister}
        >
          <Text style={globalStyles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={globalStyles.link}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>

        {error ? <Text style={globalStyles.error}>{error}</Text> : null}
        {success ? <Text style={globalStyles.success}>{success}</Text> : null}

      </View>
    </View>
  );
}