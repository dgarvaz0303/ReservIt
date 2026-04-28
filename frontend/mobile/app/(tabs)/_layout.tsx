import { Tabs, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MobileNavbar from "@/components/MobileNavbar";
import MobileFooter from "@/components/MobileFooter";

export default function TabLayout() {
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedRol = await AsyncStorage.getItem("rol");

      console.log("TOKEN:", token);
      console.log("ROL:", storedRol);

      if (!token || !storedRol) {
        router.replace("/login");
        return;
      }

      setRol(storedRol);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading || !rol) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>

      
      <MobileNavbar rol={rol} />

      <View style={{ flex: 1 }}>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="explore" />
        </Tabs>
      </View>

      <MobileFooter />

    </View>
  );
}