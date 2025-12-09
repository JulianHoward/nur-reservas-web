// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NUR_LOGO from "../assets/logo-nur.png"; // asegúrate de tener el logo aquí

export default function Register() {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo registrar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: 400,
          textAlign: "center",
        }}
      >
        <img
          src={NUR_LOGO}
          alt="Logo NUR"
          style={{ width: 120, marginBottom: 24 }}
        />

        <h2 style={{ marginBottom: 24, color: "#003366" }}>Crear cuenta</h2>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#900",
              padding: 8,
              marginBottom: 16,
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: "center", color: "#555" }}>
          ¿Ya tenés cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
