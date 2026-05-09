"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/components.css";
import jsPDF from "jspdf";

export default function ReservasEstablecimiento() {
  const { id } = useParams();
  const router = useRouter();

  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    fetchReservas();
  }, [fecha]);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const generarPDF = async () => {
    const pdf = new jsPDF();

    const fechaStr = fecha.toLocaleDateString("es-ES");

    const nombreLocal =
      reservas[0]?.establecimiento_nombre || "Establecimiento";

    let y = 20;

    const loadImage = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(img);
      });

    const logo = await loadImage(
      "https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
    );

    pdf.setFillColor(111, 78, 55);
    pdf.rect(0, 0, 210, 30, "F");

    pdf.addImage(logo, "PNG", 150, 5, 40, 20);

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text("Reservas del día", 20, 18);

    y = 40;

    pdf.setTextColor(62, 44, 35);
    pdf.setFontSize(12);

    pdf.text(`Local: ${nombreLocal}`, 20, y);
    y += 6;

    pdf.text(`Fecha: ${fechaStr}`, 20, y);
    y += 10;

    pdf.setDrawColor(176, 137, 104);
    pdf.line(20, y, 190, y);
    y += 10;

    const agrupadas = {};

    reservas.forEach((r) => {
      if (!agrupadas[r.hora]) {
        agrupadas[r.hora] = [];
      }
      agrupadas[r.hora].push(r);
    });

    const horasOrdenadas = Object.keys(agrupadas).sort();

    horasOrdenadas.forEach((hora) => {
      const lista = agrupadas[hora];

      const totalPersonas = lista.reduce(
        (acc, r) => acc + Number(r.num_personas || 0),
        0
      );

      pdf.setFont(undefined, "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(111, 78, 55);

      pdf.text(`${hora}`, 20, y);

      pdf.setFont(undefined, "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(` (${totalPersonas} personas)`, 45, y);

      y += 6;

      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y, 190, y);
      y += 6;

      lista.forEach((r) => {
        pdf.text(
          `• ${r.nombre_cliente || "Cliente"} (${r.num_personas}) - ${
            r.zona_nombre || "General"
          }`,
          25,
          y
        );

        y += 6;

        if (y > 270) {
          pdf.addPage();

          pdf.setFillColor(111, 78, 55);
          pdf.rect(0, 0, 210, 30, "F");
          pdf.addImage(logo, "PNG", 150, 5, 40, 20);

          y = 40;
        }
      });

      y += 6;
    });

    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text("Generado por ReservIt", 105, 290, { align: "center" });

    pdf.save(`reservas-${formatDate(fecha)}.pdf`);
  };

  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://reservit.onrender.com/api/reservas/establecimiento/${id}?fecha=${formatDate(fecha)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setReservas(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtrarReservas = () => {
    if (filtro === "todas") return reservas;

    return reservas.filter((r) => {
      const hora = parseInt(r.hora.split(":")[0]);

      if (filtro === "mañana") return hora >= 8 && hora <= 12;
      if (filtro === "tarde") return hora >= 13 && hora <= 19;
      if (filtro === "noche") return hora >= 20;

      return true;
    });
  };

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    if (nuevaFecha < new Date().setHours(0, 0, 0, 0)) return;

    setFecha(nuevaFecha);
  };

  const reservasFiltradas = filtrarReservas();

  return (
    <div className="page">
      <div className="container">

        {/* HEADER MEJORADO */}
        <div className="page-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn-secondary"
              onClick={() => router.push(`/locales/${id}`)}
            >
              ← Volver
            </button>

            <div>
              <h1 className="page-title">Reservas</h1>
              <p className="page-subtitle">
                Gestiona las reservas de tu establecimiento
              </p>
            </div>
          </div>

          <button className="btn-primary" onClick={generarPDF}>
            Descargar PDF
          </button>
        </div>

        {/* FECHA */}
        <div className="card" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button className="btn-secondary" onClick={() => cambiarDia(-1)}>
            ←
          </button>

          <h2 style={{ color: "var(--color-primary)", margin: 0 }}>
            {fecha.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>

          <button className="btn-secondary" onClick={() => cambiarDia(1)}>
            →
          </button>
        </div>

        {/* FILTROS */}
        <div className="filters-bar">
          <button
            className={`btn-secondary ${filtro === "mañana" ? "btn-accent" : ""}`}
            onClick={() => setFiltro("mañana")}
          >
            Mañana
          </button>

          <button
            className={`btn-secondary ${filtro === "tarde" ? "btn-accent" : ""}`}
            onClick={() => setFiltro("tarde")}
          >
            Tarde
          </button>

          <button
            className={`btn-secondary ${filtro === "noche" ? "btn-accent" : ""}`}
            onClick={() => setFiltro("noche")}
          >
            Noche
          </button>

          <button
            className="btn-secondary"
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>
        </div>

        {/* LISTA */}
        <div className="reservas-list">

          {reservasFiltradas.length === 0 ? (
            <div className="card">
              <p className="perfil-empty">
                No hay reservas para este día
              </p>
            </div>
          ) : (
            reservasFiltradas.map((r, i) => (
              <div
                key={`${r.hora}-${r.nombre_cliente}-${i}`}
                className="reserva-card"
                onClick={() =>
                  window.location.href = `/locales/${id}/reservas/${r.id}`
                }
              >
                <div style={{
                  width: 6,
                  background: "var(--color-success)"
                }} />

                <div className="reserva-content">
                  <h2>{r.nombre_cliente}</h2>

                  <p className="reserva-info">
                    {r.hora} · {r.num_personas} personas
                  </p>

                  <p className="reserva-info">
                    {r.zona_nombre || "Zona general"}
                  </p>
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}