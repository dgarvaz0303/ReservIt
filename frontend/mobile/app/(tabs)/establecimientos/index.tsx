"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { COLORS } from "@/themes/colors";
import { establecimientosStyles as styles } from "@/themes/establecimientosStyles";

export default function Establecimientos() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const res = await fetch("https://reservit.onrender.com/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Image
          source={{
            uri: "https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png",
          }}
          style={styles.logo}
        />
      </View>

      {/* LISTADO */}
      <View style={styles.container}>
        {establecimientos.map((est) => (
          <TouchableOpacity
            key={est.id}
            style={styles.card}
            activeOpacity={0.9}
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
                uri: est.imagen_url || "https://via.placeholder.com/400x200",
              }}
              style={styles.image}
            />

            {/* CONTENIDO */}
            <View style={styles.content}>
              <Text style={styles.title}>{est.nombre}</Text>

              <Text style={styles.subtitle}>{est.tipo}</Text>

              <Text style={styles.text}>{est.direccion}</Text>

              <Text style={styles.capacity}>
                {est.capacidad_total || est.capacidad || 0} plazas
              </Text>

              {/* BOTONES */}
              <View style={styles.actions}>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push({
                      pathname: "/establecimientos/[id]",
                      params: { id: est.id },
                    });
                  }}
                >
                  <Text style={styles.primaryText}>Reservar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    abrirCarta(est.carta_url);
                  }}
                >
                  <Text style={styles.secondaryText}>Ver carta</Text>
                </TouchableOpacity>

              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}