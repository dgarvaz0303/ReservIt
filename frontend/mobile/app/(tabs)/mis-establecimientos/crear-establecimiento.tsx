import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { globalStyles } from "../../../themes/styles";

// ================= TYPES =================
type Zona = {
  nombre: string;
  capacidad: string;
};

type Horario = {
  dia_semana: number;
  hora: string;
};

type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

const dias = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 7 },
];

// ================= COMPONENT =================
export default function CrearEstablecimiento() {
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
    telefono: "",
  });

  const [imagen, setImagen] = useState<UploadFile | null>(null);
  const [pdf, setPdf] = useState<UploadFile | null>(null);

  const [zonas, setZonas] = useState<Zona[]>([
    { nombre: "", capacidad: "" },
  ]);

  const [horarios, setHorarios] = useState<Horario[]>([
    { dia_semana: 1, hora: "" },
  ]);

  const capacidadTotal = zonas.reduce(
    (acc, z) => acc + Number(z.capacidad || 0),
    0
  );

  // ================= PICKERS =================
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) {
      const a = res.assets[0];
      setImagen({
        uri: a.uri,
        name: a.fileName ?? "img.jpg",
        type: a.mimeType ?? "image/jpeg",
      });
    }
  };

  const pickPdf = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (res.assets?.length) {
      const f = res.assets[0];
      setPdf({
        uri: f.uri,
        name: f.name,
        type: "application/pdf",
      });
    }
  };

  // ================= ZONAS =================
  const addZona = () =>
    setZonas([...zonas, { nombre: "", capacidad: "" }]);

  const updateZona = (i: number, field: keyof Zona, value: string) => {
    const updated = [...zonas];
    updated[i][field] = value;
    setZonas(updated);
  };

  const removeZona = (i: number) => {
    if (zonas.length === 1) return;
    setZonas(zonas.filter((_, index) => index !== i));
  };

  // ================= HORARIOS =================
  const addHorario = () =>
    setHorarios([...horarios, { dia_semana: 1, hora: "" }]);

  const updateHorario = (
    i: number,
    field: keyof Horario,
    value: string
  ) => {
    const updated = [...horarios];

    updated[i] = {
      ...updated[i],
      [field]: field === "dia_semana" ? Number(value) : value,
    };

    setHorarios(updated);
  };

  const removeHorario = (i: number) => {
    if (horarios.length === 1) return;
    setHorarios(horarios.filter((_, index) => index !== i));
  };

  // ================= CREAR =================
  const crear = async () => {
    try {
      const auth_id = await AsyncStorage.getItem("user_id");

      const direccion = form.direccion.includes("Lebrija")
        ? form.direccion
        : `${form.direccion}, Lebrija`;
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        "http://192.168.1.132:8000/api/establecimientos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            direccion,
            auth_id,
            zonas,
            horarios,
          }),
        }
      );

      if (!res.ok) {
        const d = await res.json();
        Alert.alert("Error", d.detail);
        return;
      }

      Alert.alert("Creado correctamente");
      navigation.goBack();

    } catch {
      Alert.alert("Error");
    }
  };

  // ================= UI =================
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Crear establecimiento</Text>

      <View style={globalStyles.card}>

        {/* BASICO */}
        <Text>Nombre</Text>
        <TextInput
          style={globalStyles.input}
          value={form.nombre}
          onChangeText={(t) => setForm({ ...form, nombre: t })}
        />

        <Text>Dirección</Text>
        <TextInput
          style={globalStyles.input}
          value={form.direccion}
          onChangeText={(t) => setForm({ ...form, direccion: t })}
        />

        <Text>Teléfono</Text>
        <TextInput
          style={globalStyles.input}
          keyboardType="numeric"
          value={form.telefono}
          onChangeText={(t) => setForm({ ...form, telefono: t })}
        />

        <Text>Tipo</Text>
        <TextInput
          style={globalStyles.input}
          value={form.tipo}
          onChangeText={(t) => setForm({ ...form, tipo: t })}
        />

        <Text>Capacidad total: {capacidadTotal}</Text>

        {/* ZONAS */}
        <Text style={{ marginTop: 20 }}>Zonas</Text>

        {zonas.map((z, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Zona"
              value={z.nombre}
              onChangeText={(t) => updateZona(i, "nombre", t)}
            />
            <TextInput
              style={[globalStyles.input, { width: 80 }]}
              placeholder="Cap"
              value={z.capacidad}
              onChangeText={(t) => updateZona(i, "capacidad", t)}
              keyboardType="numeric"
            />

            {i > 0 && (
              <TouchableOpacity onPress={() => removeZona(i)}>
                <Text>❌</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={addZona}>
          <Text style={{ color: "blue" }}>+ Añadir zona</Text>
        </TouchableOpacity>

        {/* HORARIOS */}
        <Text style={{ marginTop: 20 }}>Horarios</Text>

        {horarios.map((h, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 10 }}>

            {/* DIA */}
            <View style={{ flexDirection: "row", gap: 10 }}>

              <View style={{
                flex: 1,
                backgroundColor: "#eee",
                borderRadius: 10,
                justifyContent: "center"
              }}>
                <Picker
                  selectedValue={h.dia_semana}
                  mode="dropdown"
                  style={{ height: 50 }}
                  onValueChange={(value: number) =>
                    updateHorario(i, "dia_semana", String(value))
                  }
                >
                  <Picker.Item label="Lunes" value={1} />
                  <Picker.Item label="Martes" value={2} />
                  <Picker.Item label="Miércoles" value={3} />
                  <Picker.Item label="Jueves" value={4} />
                  <Picker.Item label="Viernes" value={5} />
                  <Picker.Item label="Sábado" value={6} />
                  <Picker.Item label="Domingo" value={7} />
                </Picker>
              </View>

              <TextInput
                style={[globalStyles.input, { width: 100 }]}
                placeholder="HH:MM"
                value={h.hora}
                onChangeText={(t) => updateHorario(i, "hora", t)}
              />

            </View>
          </View>
        ))}

        <TouchableOpacity onPress={addHorario}>
          <Text style={{ color: "blue" }}>+ Añadir horario</Text>
        </TouchableOpacity>

        {/* IMAGEN */}
        <Text style={{ marginTop: 20 }}>Imagen</Text>
        <TouchableOpacity onPress={pickImage}>
          <Text>Seleccionar imagen</Text>
        </TouchableOpacity>

        {imagen && (
          <Image
            source={{ uri: imagen.uri }}
            style={{ width: 100, height: 100 }}
          />
        )}

        {/* PDF */}
        <Text>Carta PDF</Text>
        <TouchableOpacity onPress={pickPdf}>
          <Text>Seleccionar PDF</Text>
        </TouchableOpacity>

        {pdf && <Text>{pdf.name}</Text>}

        {/* BOTON */}
        <TouchableOpacity
          style={globalStyles.button}
          onPress={crear}
        >
          <Text style={globalStyles.buttonText}>
            Crear establecimiento
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}