// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import NUR_LOGO from "../assets/logo-nur.png";

// Íconos simples con emojis
const icons = {
  misReservas: "📋",
  nuevaReserva: "📝",
  gestionEspacios: "🏢",
  reservasPendientes: "⏳",
  calendario: "📅",
  reportes: "📊",
};

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Simulación de datos para resumen (puedes reemplazar con fetch real)
  const resumen = {
    pendientes: 3,
    proximas: "Auditorio Principal - 10:00",
  };

  const userCards = [
    { name: "Mis Reservas", path: "/dashboard/mis-reservas", icon: icons.misReservas },
    { name: "Nueva Reserva", path: "/dashboard/nueva-reserva", icon: icons.nuevaReserva },
  ];

  const adminCards = [
    { name: "Gestión de Espacios", path: "/dashboard/espacios", icon: icons.gestionEspacios },
    { name: `Reservas Pendientes (${resumen.pendientes})`, path: "/dashboard/admin/reservas-pendientes", icon: icons.reservasPendientes },
    { name: "Calendario", path: "/dashboard/admin/calendario", icon: icons.calendario },
    { name: "Reportes", path: "/dashboard/admin/reportes", icon: icons.reportes },
    { name: "Mis Reservas", path: "/dashboard/mis-reservas", icon: icons.misReservas },
  ];

  const cards = user.role === "admin" ? adminCards : userCards;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* Menú lateral */}
      <aside style={{ width: 220, background: "#003366", color: "#fff", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src={NUR_LOGO} alt="Logo NUR" style={{ width: 100 }} />
        </div>
        <button
          onClick={logout}
          style={{ marginTop: "auto", background: "#e74c3c", color: "#fff", padding: 10, border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: 32, background: "#f5f5f5" }}>
        <h2 style={{ color: "#003366", marginBottom: 24 }}>Bienvenido, {user?.nombre || user?.correo} 👋</h2>

        {/* Grid de cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20,
        }}>
          {cards.map((card, index) => (
            <Link to={card.path} key={index} style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{card.icon}</div>
                <div style={{ fontSize: 16, fontWeight: "bold", color: "#003366", textAlign: "center" }}>
                  {card.name}
                </div>
                {/* Resumen opcional */}
                {card.name.includes("Pendientes") && user.role === "admin" && (
                  <div style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
                    {resumen.pendientes} solicitudes
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Aquí se renderizan las páginas según la ruta */}
        <div style={{ marginTop: 32 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
