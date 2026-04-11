import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { router } from "expo-router";

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Establecimientos</Text>

      <Button title="Volver" onPress={() => router.push("/")} />

      {establecimientos.map((est) => (
        <View key={est.id} style={styles.card}>
          
          {/* 🖼️ IMAGEN */}
          <Image
            source={{ uri: "https://via.placeholder.com/300" }}
            style={styles.image}
          />

          <Text style={styles.name}>{est.nombre}</Text>

          <Text>Tipo: {est.tipo}</Text>
          <Text>Dirección: {est.direccion}</Text>
          <Text>Capacidad: {est.capacidad}</Text>

          {/* BOTONES */}
          <View style={styles.buttons}>
            <Button
              title="Reservar"
              onPress={() => alert("Reserva próximamente")}
            />

            <Button
              title="Carta"
              onPress={() => console.log(est.carta_url)}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttons: {
    marginTop: 10,
    gap: 5,
  },
});