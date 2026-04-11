import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Home() {
  const [establecimientos, setEstablecimientos] = useState([]);

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

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
    <View>
      <Text>ReservIt</Text>

      
      <Text>Establecimientos más reservados</Text>

      {establecimientos.map((est) => (
        <View key={est.id}>
          <Text>{est.nombre}</Text>
          <Text>{est.tipo}</Text>
          <Text>{est.direccion}</Text>
        </View>
      ))}

      
      <Text>Próximas funcionalidades</Text>

      <View>
        <Text>Pedidos a domicilio</Text>
        <Text>Búsqueda de hoteles</Text>
        <Text>Eventos de la comunidad</Text>
      </View>
    </View>
  );
}