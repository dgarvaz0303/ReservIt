import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { globalStyles } from "../theme/styles";
import { COLORS } from "../theme/colors";

export default function Establecimientos() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const res = await fetch("http://192.168.1.132:8000/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.bg }}>

      {/* HEADER */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.title}>Establecimientos</Text>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={globalStyles.link}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* LISTADO */}
      <View style={globalStyles.section}>
        {establecimientos.map((est) => (
          <TouchableOpacity
            key={est.id}
            style={globalStyles.cardList}
            onPress={() =>
              router.push(`/establecimientos/${est.id}`)
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
              <Text style={globalStyles.cardTitle}>{est.nombre}</Text>

              <Text style={globalStyles.cardText}>
                {est.tipo}
              </Text>

              <Text style={globalStyles.cardText}>
                 {est.direccion}
              </Text>

              <Text style={globalStyles.cardText}>
                 Capacidad: {est.capacidad}
              </Text>

              {/* BOTONES */}
              <View style={{ marginTop: 10, gap: 8 }}>
                
                <TouchableOpacity
                  style={globalStyles.button}
                  onPress={(e) => {
                    e.stopPropagation();
                    alert("Reserva próximamente");
                  }}
                >
                  <Text style={globalStyles.buttonText}>
                    Reservar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    console.log(est.carta_url);
                  }}
                >
                  <Text style={globalStyles.link}>
                    Ver carta
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