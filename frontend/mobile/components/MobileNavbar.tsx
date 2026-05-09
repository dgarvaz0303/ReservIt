import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type Rol = "cliente" | "supervisor" | "admin";

export default function MobileNavbar({ rol }: { rol: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");

  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    const loadUser = async () => {
      const nombre = await AsyncStorage.getItem("nombre");
      setUser(nombre || "Usuario");
    };

    loadUser();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 0 : -width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  const linksByRole: Record<Rol, { name: string; path: any }[]> = {
    cliente: [
      { name: "Inicio", path: "/(tabs)" },
      { name: "Establecimientos", path: "/(tabs)/establecimientos" },
      { name: "Mis reservas", path: "/(tabs)/reservas" },
      { name: "Perfil", path: "/(tabs)/perfil" },
    ],
    supervisor: [
      { name: "Inicio", path: "/(tabs)" },
      { name: "Establecimientos", path: "/(tabs)/establecimientos" },
      { name: "Mis reservas", path: "/(tabs)/reservas" },
      { name: "Mis locales", path: "/(tabs)/mis-establecimientos" },
      { name: "Perfil", path: "/(tabs)/perfil" },
    ],
    admin: [
      { name: "Inicio", path: "/(tabs)" },
      { name: "Establecimientos", path: "/(tabs)/establecimientos" },
      { name: "Mis reservas", path: "/(tabs)/reservas" },
      { name: "Perfil", path: "/(tabs)/perfil" },
    ],
  };

  const links = linksByRole[rol as Rol] || [];

  return (
    <>
      {/* 🔝 NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text style={styles.hamburger}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>ReservIt</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* 🌑 OVERLAY */}
      {open && (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
      )}

      {/* 📱 MENU LATERAL */}
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* USER */}
        <Text style={styles.user}>{user}</Text>

        {/* LINKS */}
        {links.map((link) => (
          <TouchableOpacity
            key={link.name}
            onPress={() => {
              setOpen(false);
              router.replace(link.path);
            }}
            style={styles.link}
          >
            <Text style={styles.linkText}>{link.name}</Text>
          </TouchableOpacity>
        ))}

        {/* SEPARADOR */}
        <View style={styles.separator} />

        <TouchableOpacity
          onPress={() => {
            setOpen(false);
            router.replace("/(tabs)/establecimientos");
          }}
          style={styles.link}
        >
          <Text style={styles.linkText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.link}
        >
          <Text style={[styles.linkText, { color: "#ff4d4d" }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  hamburger: {
    color: "#fff",
    fontSize: 22,
  },

  logo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000088",
    zIndex: 1,
  },

  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.75,
    height: "100%",
    backgroundColor: "#000",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 2,
  },

  user: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },

  link: {
    paddingVertical: 14,
  },

  linkText: {
    color: "#fff",
    fontSize: 16,
  },

  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 15,
  },
});