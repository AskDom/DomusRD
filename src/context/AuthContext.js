import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// El backend guarda roles en MAYÚSCULAS — normalizamos a mayúscula inicial
const ROLE_DISPLAY = { CLIENTE: "Cliente", VENDEDOR: "Vendedor", AGENTE: "Agente", ADMIN: "Admin" };
const normalizeUser = (user) => ({ ...user, role: ROLE_DISPLAY[user.role] || user.role });

const saveSession  = (token, user) => {
  localStorage.setItem("domusrd-token",   token);
  localStorage.setItem("domusrd-session", JSON.stringify(user));
};
const clearSession = () => {
  localStorage.removeItem("domusrd-token");
  localStorage.removeItem("domusrd-session");
};
const loadSession  = () => {
  try { const u = localStorage.getItem("domusrd-session"); return u ? JSON.parse(u) : null; }
  catch { return null; }
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSession);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [bootDone,    setBootDone]    = useState(false);

  // ── AL ARRANCAR: verificar el token con el backend ────────────────────────
  // Esto garantiza que si el rol cambió en la BD (ej. ADMIN),
  // el frontend lo refleja sin necesidad de cerrar sesión manualmente
  useEffect(() => {
    const token = localStorage.getItem("domusrd-token");
    if (!token) { setBootDone(true); return; }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => {
        const user = normalizeUser(data.user);
        // Actualizamos sesión con los datos frescos de la BD (rol incluido)
        localStorage.setItem("domusrd-session", JSON.stringify(user));
        setCurrentUser(user);
      })
      .catch((status) => {
        // Token inválido o expirado — limpiamos sesión
        if (status === 401 || status === 403) clearSession();
        setCurrentUser(null);
      })
      .finally(() => setBootDone(true));
  }, []);

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password, role }) => {
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al crear la cuenta."); return false; }
      const user = normalizeUser(data.user);
      saveSession(data.token, user);
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    } finally { setLoading(false); }
  }, []);

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Correo o contraseña incorrectos."); return false; }
      const user = normalizeUser(data.user);
      saveSession(data.token, user);
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    } finally { setLoading(false); }
  }, []);

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("domusrd-token"), []);

  // Mientras verifica el token no renderizamos nada — evita flash de rol incorrecto
  if (!bootDone) return null;

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, error, setError, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}