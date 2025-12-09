import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { api } from "../api/client";
import { getEspaciosVisibles } from "../api/espacios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function AdminCalendario() {
  const [reservas, setReservas] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [espacioFiltro, setEspacioFiltro] = useState("");
  const [vista, setVista] = useState("month");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar espacios
        const espaciosRes = await getEspaciosVisibles();
        const arr = Array.isArray(espaciosRes.data) ? espaciosRes.data : espaciosRes.data.data || [];
        setEspacios(arr);

        // Cargar reservas
        const params = espacioFiltro ? { espacio_id: espacioFiltro } : {};
        const res = await api.get("/reservas", { params });
        const events = res.data.map((r) => ({
          start: new Date(r.fecha_inicio),
          end: new Date(r.fecha_fin),
          title: `${r.espacio?.nombre || r.espacio_id} - ${r.tipo_evento}`,
          reserva: r,
        }));
        setReservas(events);
      } catch (err) {
        console.error(err);
      }
    };
    cargarDatos();
  }, [espacioFiltro]);

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
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h2 style={{ margin: 0, color: "#003366" }}>Calendario de Reservas</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={espacioFiltro}
            onChange={(e) => setEspacioFiltro(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="">Todos los espacios</option>
            {espacios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <select
            value={vista}
            onChange={(e) => setVista(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="month">Mes</option>
            <option value="week">Semana</option>
            <option value="day">Día</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
      </div>

      {/* Leyenda */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          padding: 12,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: "#f0ad4e",
              borderRadius: 4,
            }}
          />
          <span>Pendiente</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: "#5cb85c",
              borderRadius: 4,
            }}
          />
          <span>Aprobado</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: "#d9534f",
              borderRadius: 4,
            }}
          />
          <span>Rechazado</span>
        </div>
      </div>

      <div
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#fff",
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
          views={["month", "week", "day", "agenda"]}
          view={vista}
          onView={(view) => setVista(view)}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
          }}
        />
      </div>
    </div>
  );
}
