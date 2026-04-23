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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { globalStyles } from "../../../themes/styles";
import { COLORS } from "../../../themes/colors";

export default function CrearEstablecimiento() {
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    capacidad: "",
    tipo: "",
  });

  const [imagen, setImagen] = useState<any>(null);
  const [pdf, setPdf] = useState<any>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setImagen(res.assets[0]);
    }
  };

  const pickPdf = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (res.assets) {
      setPdf(res.assets[0]);
    }
  };

  const uploadFile = async (file: any, bucket: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: fileName,
      type: file.mimeType || "application/octet-stream",
    } as any);

    const res = await fetch(
      `https://TU_PROJECT_ID.supabase.co/storage/v1/object/${bucket}/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer TU_SUPABASE_KEY`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Error subiendo archivo");

    return `https://TU_PROJECT_ID.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
  };

  const crear = async () => {
    try {
      const auth_id = await AsyncStorage.getItem("user_id");

      let imagen_url = null;
      let carta_url = null;

      if (imagen) imagen_url = await uploadFile(imagen, "imagenes");
      if (pdf) carta_url = await uploadFile(pdf, "cartas");

      const res = await fetch(
        "http://192.168.1.132:8000/api/establecimientos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            capacidad: Number(form.capacidad),
            imagen_url,
            carta_url,
            auth_id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.detail);
        return;
      }

      Alert.alert("Establecimiento creado");
      navigation.goBack();

    } catch (err) {
      console.log(err);
      Alert.alert("Error al crear establecimiento");
    }
  };

  return (
    <ScrollView style={globalStyles.container}>

      <Text style={globalStyles.title}>Crear establecimiento</Text>

      <View style={globalStyles.card}>

        <TextInput
          placeholder="Nombre"
          value={form.nombre}
          onChangeText={(t) => setForm({ ...form, nombre: t })}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Dirección"
          value={form.direccion}
          onChangeText={(t) => setForm({ ...form, direccion: t })}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Capacidad"
          value={form.capacidad}
          onChangeText={(t) => setForm({ ...form, capacidad: t })}
          keyboardType="numeric"
          style={globalStyles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Tipo"
          value={form.tipo}
          onChangeText={(t) => setForm({ ...form, tipo: t })}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />

        {/* IMAGEN */}
        <TouchableOpacity
          onPress={pickImage}
          style={[globalStyles.buttonSecondary]}
        >
          <Text style={globalStyles.buttonSecondaryText}>
            Seleccionar imagen
          </Text>
        </TouchableOpacity>

        {imagen && (
          <Image
            source={{ uri: imagen.uri }}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        )}

        {/* PDF */}
        <TouchableOpacity
          onPress={pickPdf}
          style={[globalStyles.buttonSecondary]}
        >
          <Text style={globalStyles.buttonSecondaryText}>
            Seleccionar carta (PDF)
          </Text>
        </TouchableOpacity>

        {pdf && (
          <Text style={{ color: COLORS.text, marginTop: 8 }}>
            {pdf.name}
          </Text>
        )}

        {/* BOTÓN */}
        <TouchableOpacity
          onPress={crear}
          style={globalStyles.button}
        >
          <Text style={globalStyles.buttonText}>
            Crear establecimiento
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}