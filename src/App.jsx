import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Espacios from "./pages/Espacios";
import MisReservas from "./pages/MisReservas";
import AdminCalendario from "./pages/AdminCalendario";
import FormReserva from "./pages/FormReserva";
import Reportes from "./pages/Reportes";
import Notificaciones from "./pages/Notificaciones";
import Configuracion from "./pages/Configuracion";
import DisponibilidadEspacio from "./pages/DisponibilidadEspacio";

import NUR_LOGO from "./assets/logo-nur.png";
import ReservasPendientes from "./pages/ReservasPendientes";

function Home() {
  return (
    <div className="home-container">
      <img src={NUR_LOGO} alt="Logo NUR" />
      <h1>NUR Reservas</h1>
      <p>Bienvenido al sistema de reservas 👋</p>
      <div className="home-buttons">
        <Link to="/login" className="btn-primary">
          Iniciar sesión
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          Dashboard
        </Link>
        <Link to="/register" className="btn-gray">
          Registrarse
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="espacios" element={<Espacios />} />
          <Route path="mis-reservas" element={<MisReservas />} />
          <Route path="nueva-reserva" element={<FormReserva />} />
          <Route path="notificaciones" element={<Notificaciones />} />
          <Route path="admin/calendario" element={<AdminCalendario />} />
          <Route
            path="admin/reservas-pendientes"
            element={<ReservasPendientes />}
          />
          <Route path="admin/reportes" element={<Reportes />} />
          <Route path="admin/configuracion" element={<Configuracion />} />
          <Route path="admin/disponibilidad" element={<DisponibilidadEspacio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
