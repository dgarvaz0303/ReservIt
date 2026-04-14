import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MobileNavbar({ rol }: { rol: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const nombre = await AsyncStorage.getItem("nombre");
      setUser(nombre || "Usuario");
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("nombre");
    await AsyncStorage.removeItem("rol");

    router.replace("/login");
  };

  type Rol = "cliente" | "supervisor" | "admin";

    const linksByRole: Record<Rol, { name: string; path: string }[]> = {
    cliente: [
        { name: "Inicio", path: "/" },
        { name: "Establecimientos", path: "/establecimientos" },
        { name: "Mis reservas", path: "/reservas" },
        { name: "Perfil", path: "/perfil" },
    ],
    supervisor: [
        { name: "Inicio", path: "/" },
        { name: "Establecimientos", path: "/establecimientos" },
        { name: "Mis reservas", path: "/reservas" },
        { name: "Mis locales", path: "/locales" },
        { name: "Perfil", path: "/perfil" },
    ],
    admin: [
        { name: "Inicio", path: "/" },
        { name: "Establecimientos", path: "/establecimientos" },
        { name: "Mis reservas", path: "/reservas" },
        { name: "Administración", path: "/admin" },
        { name: "Perfil", path: "/perfil" },
    ],
    };

    const links = linksByRole[rol as keyof typeof linksByRole];



  return (
    <View style={{ padding: 16 }}>

      {/* LOGO */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>ReservIt</Text>
      </TouchableOpacity>

      {/* LINKS */}
      <View>
        {links.map((link) => (
          <TouchableOpacity
            key={link.path}
            onPress={() => router.push(link.path as any)}
          >
            <Text>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* USUARIO */}
      <View>
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Text>{user}</Text>
        </TouchableOpacity>

        {open && (
          <View>
            <TouchableOpacity onPress={() => router.push("/perfil" as any)}>
              <Text>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </View>
  );
}