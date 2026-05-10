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
      const res = await fetch("https://reservit.onrender.com/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(data.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container hero-content">

            {/* LOGO */}
            <img
              src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
              alt="ReservIt"
              className="hero-logo"
            />

            <p className="hero-text">
              Reserva en segundos, descubre nuevos sitios y vive experiencias únicas.
            </p>

            <button
              className="btn-primary"
              onClick={() => router.push("/establecimientos")}
            >
              Explorar ahora
            </button>

          </div>
        </div>
      </section>

      {/* MÁS RESERVADOS */}
      <section className="section section-white">
        <div className="container">
          <h2 className="section-title">Más reservados</h2>

          <div className="grid grid-3">
            {establecimientos.map((est) => (
              <div
                key={est.id}
                className="landing-card clickable"
                onClick={() => router.push(`/establecimientos/${est.id}`)}
              >
                <div className="card-image">
                  <img
                    src={est.imagen_url || "/placeholder.jpg"}
                    alt={est.nombre}
                  />
                </div>

                <div className="card-body">
                  <h3 className="card-title">{est.nombre}</h3>
                  <p className="card-sub">{est.tipo}</p>
                  <p className="card-text">{est.direccion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">Lo que viene</h2>

          <p className="landing-text">
            Estamos construyendo la plataforma definitiva para salir, descubrir y disfrutar.
            Esto es solo el comienzo.
          </p>

          <div className="features">

            <div className="feature-row">
              <h3>Pedidos a domicilio</h3>
              <p>
                Pide directamente desde tus restaurantes favoritos sin salir de la app.
              </p>
            </div>

            <div className="feature-row alt">
              <h3>Búsqueda de hoteles</h3>
              <p>
                Planea escapadas completas: reserva mesa y alojamiento en un solo lugar.
              </p>
            </div>

            <div className="feature-row">
              <h3>Eventos y comunidad</h3>
              <p>
                Descubre eventos locales y experiencias gastronómicas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-accent">
        <div className="container">
          <div className="cta">
            <h2 className="cta-title">Empieza a descubrir</h2>

            <p className="cta-text">
              Encuentra tu próximo sitio favorito hoy mismo.
            </p>

            <button
              className="btn-primary"
              onClick={() => router.push("/establecimientos")}
            >
              Ver establecimientos
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}