import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

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

  // 🔥 equivalente a handleChange web
  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
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

      setSuccess("Usuario registrado correctamente");

      // limpiar formulario
      setForm({
        nombre: "",
        nombre_user: "",
        email: "",
        telefono: "",
        password: "",
      });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View>
      <Text>Registro</Text>

      <TextInput
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => handleChange("nombre", text)}
      />

      <TextInput
        placeholder="Nombre de usuario"
        value={form.nombre_user}
        onChangeText={(text) => handleChange("nombre_user", text)}
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        placeholder="Teléfono"
        value={form.telefono}
        onChangeText={(text) => handleChange("telefono", text)}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <Button title="Registrarse" onPress={handleSubmit} />

      {error ? <Text>{error}</Text> : null}
      {success ? <Text>{success}</Text> : null}
    </View>
  );
}