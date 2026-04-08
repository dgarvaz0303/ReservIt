"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      await fetchEstablecimientos();
      setLoading(false);
    }
  };

  const fetchEstablecimientos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/establecimientos");

      const data = await res.json();

      setEstablecimientos(data.slice(0, 3));

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 evita parpadeo
  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>ReservIt</h1>

      {/* 🔥 TOP */}
      <section>
        <h2>Establecimientos más reservados</h2>

        {establecimientos.map((est) => (
          <div key={est.id}>
            <h3>{est.nombre}</h3>
            <p>{est.tipo}</p>
            <p>{est.direccion}</p>
          </div>
        ))}
      </section>

      {/* 🚀 FUTURO */}
      <section>
        <h2>Próximas funcionalidades</h2>

        <div>
          <div>
            <h3>Pedidos a domicilio</h3>
          </div>

          <div>
            <h3>Búsqueda de hoteles</h3>
          </div>

          <div>
            <h3>Eventos de la comunidad</h3>
          </div>
        </div>
      </section>
    </div>
  );
}