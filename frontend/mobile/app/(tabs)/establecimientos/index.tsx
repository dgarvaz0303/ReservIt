"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { globalStyles } from "@/themes/styles";
import { COLORS } from "@/themes/colors";

export default function Establecimientos() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const res = await fetch("http://192.168.1.132:8000/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ABRIR PDF CARTA
  // =========================
  const abrirCarta = async (url: string) => {
    if (!url) {
      alert("Este establecimiento no tiene carta");
      return;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("No se puede abrir la carta");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.bg }}>

      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png",
          }}
          style={styles.logo}
        />
      </View>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* LISTADO */}
      <View style={globalStyles.section}>
        {establecimientos.map((est) => (
          <TouchableOpacity
            key={est.id}
            style={globalStyles.cardList}
            onPress={() =>
              router.push({
                pathname: "/establecimientos/[id]",
                params: { id: est.id },
              })
            }
          >
            {/* IMAGEN */}
            <Image
              source={{
                uri: est.imagen_url || "https://via.placeholder.com/300",
              }}
              style={globalStyles.imagePlaceholder}
            />

            {/* CONTENIDO */}
            <View style={globalStyles.cardContent}>
              <Text style={globalStyles.cardTitle}>
                {est.nombre}
              </Text>

              <Text style={globalStyles.cardText}>
                {est.tipo}
              </Text>

              <Text style={globalStyles.cardText}>
                {est.direccion}
              </Text>

              <Text style={globalStyles.cardText}>
                Capacidad: {est.capacidad_total || est.capacidad || 0}
              </Text>

              {/* BOTONES */}
              <View style={styles.actions}>

                <TouchableOpacity
                  style={globalStyles.button}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push({
                      pathname: "/establecimientos/[id]",
                      params: { id: est.id },
                    });
                  }}
                >
                  <Text style={globalStyles.buttonText}>
                    Reservar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pdfBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    abrirCarta(est.carta_url);
                  }}
                >
                  <Text style={styles.pdfText}>
                    📄 Ver carta
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  backBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  backText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  actions: {
    marginTop: 10,
    gap: 8,
  },

  pdfBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  pdfText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});