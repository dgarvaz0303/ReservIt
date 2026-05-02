import { View } from "react-native";
import { Slot, router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MobileNavbar from "@/components/MobileNavbar";
import MobileFooter from "@/components/MobileFooter";

export default function MainLayout() {
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedRol = await AsyncStorage.getItem("rol");

      // si no hay token  fuera
      if (!token) {
        router.replace("/login");
        return;
      }
      setRol(storedRol);
    };

    loadSession();
  }, []);

  // evitar render hasta tener rol
  if (!rol) return null;

  return (
    <View style={{ flex: 1 }}>

      <MobileNavbar rol={rol} />

      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      <MobileFooter />

    </View>
  );
}