import { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <ScrollView>
      <Text>ReservIt</Text>

      <Button title="Ver establecimientos" onPress={() => router.push("/")} />
      <Button title="Logout" onPress={logout} />

      {establecimientos.map((est) => (
        <View key={est.id}>
          <Text>{est.nombre}</Text>
          <Text>{est.tipo}</Text>
        </View>
      ))}
    </ScrollView>
  );
}