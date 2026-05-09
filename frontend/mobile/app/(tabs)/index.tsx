import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../../themes/styles";
import { landingStyles } from "../../themes/landingStyles";
import { COLORS } from "../../themes/colors";

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
      const res = await fetch("https://reservit.onrender.com/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(data.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.bg }}>

      {/* HERO */}
      <ImageBackground
        src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/flautas-transformed.jpeg"
        style={landingStyles.hero}
        imageStyle={{ opacity: 0.6 }}
      >
        <View style={landingStyles.overlay} />

        <View style={landingStyles.heroContent}>
          <Image
            src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
            style={landingStyles.logo}
            resizeMode="contain"
          />

          <Text style={landingStyles.heroText}>
            Reserva en segundos y descubre nuevos sitios
          </Text>
        </View>
      </ImageBackground>

      {/* TOP ESTABLECIMIENTOS */}
      <View style={[globalStyles.section, globalStyles.sectionWhite]}>
        <Text style={globalStyles.sectionTitle}>Más reservados</Text>

        {establecimientos.map((est) => (
          <TouchableOpacity
            key={est.id}
            style={landingStyles.card}
            onPress={() =>
              router.push({
                pathname: "/establecimientos/[id]",
                params: { id: est.id },
              })
            }
          >
            <Image
              source={{
                uri: est.imagen_url || "https://via.placeholder.com/400x200"
              }}
              style={landingStyles.cardImage}
            />

            <View style={landingStyles.cardContent}>
              <Text style={landingStyles.cardTitle}>{est.nombre}</Text>
              <Text style={landingStyles.cardSubtitle}>{est.tipo}</Text>
              <Text style={landingStyles.cardText}>{est.direccion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* FUTURO */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Lo que viene</Text>

        <View style={landingStyles.feature}>
          <Text style={landingStyles.featureTitle}>Pedidos a domicilio</Text>
          <Text style={landingStyles.featureText}>
            Pide directamente desde tus restaurantes favoritos sin salir de la app.
          </Text>
        </View>

        <View style={landingStyles.feature}>
          <Text style={landingStyles.featureTitle}>Hoteles</Text>
          <Text style={landingStyles.featureText}>
            Reserva mesa y alojamiento en un solo lugar.
          </Text>
        </View>

        <View style={landingStyles.feature}>
          <Text style={landingStyles.featureTitle}>Eventos</Text>
          <Text style={landingStyles.featureText}>
            Descubre experiencias y conecta con gente.
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={landingStyles.cta}>
        <Text style={landingStyles.ctaTitle}>Empieza a descubrir</Text>

        <TouchableOpacity
          style={globalStyles.button}
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