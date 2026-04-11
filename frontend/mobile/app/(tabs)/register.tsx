import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { router } from "expo-router";

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

      // ir al login
      router.replace("/login");

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View>
      <Text>Registro</Text>

      <TextInput placeholder="Nombre" onChangeText={(v) => handleChange("nombre", v)} />
      <TextInput placeholder="Usuario" onChangeText={(v) => handleChange("nombre_user", v)} />
      <TextInput placeholder="Email" onChangeText={(v) => handleChange("email", v)} />
      <TextInput placeholder="Teléfono" onChangeText={(v) => handleChange("telefono", v)} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={(v) => handleChange("password", v)} />

      <Button title="Registrarse" onPress={handleRegister} />

      <Button title="Ir a login" onPress={() => router.push("/login")} />

      {error ? <Text>{error}</Text> : null}
      {success ? <Text>{success}</Text> : null}
    </View>
  );
}