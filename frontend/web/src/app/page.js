"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/landing.css";

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

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="landing">

      {/* HERO */}
      <section className="section section-light">
        <h1 className="section-title">ReservIt</h1>

        <p className="landing-text">
          Reserva en segundos, descubre nuevos sitios y gestiona tus experiencias
          gastronómicas como nunca antes.
        </p>
      </section>

      {/* TOP ESTABLECIMIENTOS */}
      <section className="section section-white">
        <h2 className="section-title">Más reservados</h2>

        <div className="grid grid-3">
          {establecimientos.map((est) => (
            <div
              key={est.id}
              className="landing-card landing-card-white"
              onClick={() => router.push(`/establecimientos/${est.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{est.nombre}</h3>
              <p>{est.tipo}</p>
              <p>{est.direccion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FUTURO */}
      <section className="section section-light">
        <h2 className="section-title">🚀 Lo que viene</h2>

        <p className="landing-text">
          Estamos construyendo la plataforma definitiva para salir, descubrir y disfrutar.
          Esto es solo el comienzo.
        </p>

        <div className="grid grid-3">
          <div className="landing-card feature">
            <h3>Pedidos a domicilio</h3>
            <p>
              Pide directamente desde tus restaurantes favoritos sin salir de la app.
              Más rápido, más fácil, más tuyo.
            </p>
          </div>

          <div className="landing-card feature">
            <h3>Búsqueda de hoteles</h3>
            <p>
              Planea escapadas completas: reserva mesa y alojamiento en un solo lugar.
            </p>
          </div>

          <div className="landing-card feature">
            <h3>Eventos y comunidad</h3>
            <p>
              Descubre eventos locales, experiencias gastronómicas y conecta con gente.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section section-accent">
        <div className="cta">
          <h2>Empieza a descubrir</h2>
          <p>
            Encuentra tu próximo sitio favorito hoy mismo.
          </p>

          <button
            className="btn-primary"
            onClick={() => router.push("/establecimientos")}
          >
            Ver establecimientos
          </button>
        </div>
      </section>

    </div>
  );
}