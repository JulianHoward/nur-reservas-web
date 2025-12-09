import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNotificacionesNoLeidas } from "../api/notificaciones";

export default function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const cargarCount = async () => {
      try {
        const res = await getNotificacionesNoLeidas();
        setCount(res.data.count || 0);
      } catch (err) {
        console.error("Error cargando notificaciones:", err);
      }
    };
    cargarCount();
    const interval = setInterval(cargarCount, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <Link
      to="/dashboard/notificaciones"
      style={{
        position: "relative",
        textDecoration: "none",
        color: "#003366",
        fontSize: 24,
        display: "inline-block",
      }}
    >
      🔔
      <span
        style={{
          position: "absolute",
          top: -8,
          right: -8,
          background: "#e74c3c",
          color: "#fff",
          borderRadius: "50%",
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        {count > 9 ? "9+" : count}
      </span>
    </Link>
  );
}

