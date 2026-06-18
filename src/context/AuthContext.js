import React, { createContext, useContext, useState, useCallback } from "react";

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── NORMALIZACIÓN DE ROL ────────────────────────────────────────────────────
// El backend guarda roles en MAYÚSCULAS (VENDEDOR, AGENTE, CLIENTE)
// El frontend los compara con mayúscula inicial (Vendedor, Agente, Cliente)
// Normalizamos aquí una sola vez para no tocar ningún otro archivo
const ROLE_DISPLAY = { CLIENTE: "Cliente", VENDEDOR: "Vendedor", AGENTE: "Agente" };
const normalizeUser = (user) => ({ ...user, role: ROLE_DISPLAY[user.role] || user.role });

// ─── SESSION HELPERS ─────────────────────────────────────────────────────────
const saveSession = (token, user) => {
  localStorage.setItem("domusrd-token", token);
  localStorage.setItem("domusrd-session", JSON.stringify(user));
};
const clearSession = () => {
  localStorage.removeItem("domusrd-token");
  localStorage.removeItem("domusrd-session");
};
const loadSession = () => {
  try {
    const user = localStorage.getItem("domusrd-session");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSession);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = useCallback(async ({ name, email, password, role }) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al crear la cuenta."); return false; }

      const user = normalizeUser(data.user); // VENDEDOR → Vendedor
      saveSession(data.token, user);
      setCurrentUser(user);
      return true;
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Correo o contraseña incorrectos."); return false; }

      const user = normalizeUser(data.user); // AGENTE → Agente
      saveSession(data.token, user);
      setCurrentUser(user);
      return true;
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("domusrd-token"), []);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, error, setError, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}