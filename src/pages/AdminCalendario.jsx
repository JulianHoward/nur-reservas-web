import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { api } from "../api/client";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function AdminCalendario() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await api.get("/reservas");
        const events = res.data.map((r) => ({
          start: new Date(r.fecha_inicio),
          end: new Date(r.fecha_fin),
          title: `${r.tipo_evento} - ${r.estado}`,
          reserva: r,
        }));
        setReservas(events);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservas();
  }, []);

  const handleSelectEvent = async (event) => {
    const reserva = event.reserva;
    if (reserva.estado === "pendiente") {
      const action = window.prompt(
        `Reserva pendiente: ${event.title}\nEscribe "aprobar" o "rechazar"`
      );

      if (action === "aprobar") {
        try {
          await api.put(`/reservas/${reserva.id}/aprobar`);
          alert("Reserva aprobada ✅");
          setReservas((prev) =>
            prev.map((e) =>
              e.reserva.id === reserva.id
                ? {
                    ...e,
                    reserva: { ...e.reserva, estado: "aprobado" },
                    title: e.title.replace("pendiente", "aprobado"),
                  }
                : e
            )
          );
        } catch (err) {
          console.error(err);
          alert("Error al aprobar reserva ❌");
        }
      } else if (action === "rechazar") {
        const motivo = window.prompt("Motivo del rechazo:");
        if (!motivo) return;

        try {
          await api.put(`/reservas/${reserva.id}/rechazar`, { motivo_rechazo: motivo });
          alert("Reserva rechazada ❌");
          setReservas((prev) =>
            prev.map((e) =>
              e.reserva.id === reserva.id
                ? {
                    ...e,
                    reserva: { ...e.reserva, estado: "rechazado" },
                    title: e.title.replace("pendiente", "rechazado"),
                  }
                : e
            )
          );
        } catch (err) {
          console.error(err);
          alert("Error al rechazar reserva ❌");
        }
      }
    } else {
      alert(`Reserva: ${event.title}`);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#f0ad4e"; // pendiente
    if (event.reserva.estado === "aprobado") backgroundColor = "#5cb85c";
    if (event.reserva.estado === "rechazado") backgroundColor = "#d9534f";

    return {
      style: {
        backgroundColor,
        color: "#fff",
        borderRadius: "6px",
        padding: "2px 6px",
        border: "none",
        fontWeight: "500",
      },
    };
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#333" }}>
        Calendario de Reservas
      </h2>
      <div
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Calendar
          localizer={localizer}
          events={reservas}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "650px", padding: "10px" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}
