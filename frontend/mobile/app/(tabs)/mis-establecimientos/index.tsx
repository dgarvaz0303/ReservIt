"use client";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";
import { misEstStyles as styles } from "@/themes/misEstablecimientosStyles";

export default function MisEstablecimientosScreen() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        "https://reservit.onrender.com/api/establecimientos/propietario",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setEstablecimientos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const eliminar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(
        `https://reservit.onrender.com/api/establecimientos/${selectedId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedId(null);
      setConfirmText("");
      fetchEstablecimientos();
    } catch (err) {
      console.log(err);
    }
  };

  const filtrados = establecimientos.filter((e) => {
    const matchNombre = e.nombre
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchTipo = tipo
      ? e.tipo?.toLowerCase().includes(tipo.toLowerCase())
      : true;

    return matchNombre && matchTipo;
  });

  return (
    <View style={globalStyles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={globalStyles.title}>Mis establecimientos</Text>

        <TouchableOpacity
          style={[globalStyles.button, styles.createBtn]}
          onPress={() =>
            router.push("/mis-establecimientos/crear-establecimiento")
          }
        >
          <Text style={globalStyles.buttonText}>+ Crear nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <View style={styles.filtros}>
        <TextInput
          placeholder="Buscar establecimiento..."
          value={search}
          onChangeText={setSearch}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Tipo (Bar, Restaurante...)"
          value={tipo}
          onChangeText={setTipo}
          style={globalStyles.input}
          placeholderTextColor="#888"
        />
      </View>

      {/* LISTA */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/mis-establecimientos/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Image
                source={{
                  uri:
                    item.imagen_url ||
                    "https://via.placeholder.com/300",
                }}
                style={styles.image}
              />

              <View style={styles.content}>
                <Text style={styles.title}>{item.nombre}</Text>

                <Text style={styles.text}>{item.direccion}</Text>

                <Text style={styles.text}>
                  Capacidad: {item.capacidad}
                </Text>

                <Text style={styles.text}>{item.tipo}</Text>
              </View>
            </TouchableOpacity>

            {/* ELIMINAR */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setSelectedId(item.id)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>

          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={!!selectedId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[globalStyles.card, styles.modalCard]}>

            <Text style={globalStyles.title}>
              ¿Eliminar establecimiento?
            </Text>

            <Text style={styles.modalText}>
              Escribe DELETE para confirmar
            </Text>

            <TextInput
              placeholder="DELETE"
              value={confirmText}
              onChangeText={setConfirmText}
              style={globalStyles.input}
              placeholderTextColor="#888"
            />

            <TouchableOpacity
              disabled={confirmText !== "DELETE"}
              style={[
                globalStyles.button,
                {
                  marginTop: 10,
                  backgroundColor:
                    confirmText === "DELETE"
                      ? COLORS.accent
                      : "#ccc",
                },
              ]}
              onPress={eliminar}
            >
              <Text style={globalStyles.buttonText}>
                Confirmar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedId(null);
                setConfirmText("");
              }}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}