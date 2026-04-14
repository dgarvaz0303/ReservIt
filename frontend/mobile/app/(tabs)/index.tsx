import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../theme/styles";
import { COLORS } from "../theme/colors";

export default function Home() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      fetchEstablecimientos();
    }
  };

  const fetchEstablecimientos = async () => {
    try {
      const res = await fetch("http://192.168.1.132:8000/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(data.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.bg }}>

      {/* HERO */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.title}>ReservIt</Text>

        <Text style={globalStyles.text}>
          Reserva en segundos, descubre nuevos sitios y gestiona tus experiencias
          gastronómicas como nunca antes.
        </Text>
      </View>

      {/* TOP ESTABLECIMIENTOS */}
      <View style={[globalStyles.section, globalStyles.sectionWhite]}>
        <Text style={globalStyles.sectionTitle}>Más reservados</Text>

        {establecimientos.map((est) => (
          <TouchableOpacity
            key={est.id}
            style={globalStyles.cardList}
            onPress={() =>
              router.push(`/establecimientos/${est.id}`)
            }
          >
            <View style={globalStyles.imagePlaceholder} />

            <View style={globalStyles.cardContent}>
              <Text style={globalStyles.cardTitle}>{est.nombre}</Text>
              <Text style={globalStyles.cardText}>{est.tipo}</Text>
              <Text style={globalStyles.cardText}>{est.direccion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* FUTURO */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}> Lo que viene</Text>

        <Text style={globalStyles.text}>
          Estamos construyendo la plataforma definitiva para salir, descubrir y disfrutar.
          Esto es solo el comienzo.
        </Text>

        <View style={{ marginTop: 16 }}>
          <Text style={globalStyles.cardTitle}>Pedidos a domicilio</Text>
          <Text style={globalStyles.cardText}>
            Pide directamente desde tus restaurantes favoritos sin salir de la app.
            Más rápido, más fácil, más tuyo.
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={globalStyles.cardTitle}>Búsqueda de hoteles</Text>
          <Text style={globalStyles.cardText}>
            Planea escapadas completas: reserva mesa y alojamiento en un solo lugar.
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={globalStyles.cardTitle}>Eventos y comunidad</Text>
          <Text style={globalStyles.cardText}>
            Descubre eventos locales, experiencias gastronómicas y conecta con gente.
          </Text>
        </View>
      </View>

      {/* CTA FINAL */}
      <View style={globalStyles.cta}>
        <Text style={globalStyles.ctaTitle}>Empieza a descubrir</Text>

        <Text style={globalStyles.ctaText}>
          Encuentra tu próximo sitio favorito hoy mismo.
        </Text>

        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 16 }]}
          onPress={() => router.push("/establecimientos")}
        >
          <Text style={globalStyles.buttonText}>
            Ver establecimientos
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}