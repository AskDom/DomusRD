import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ROLE_DISPLAY = { CLIENTE: "Cliente", VENDEDOR: "Vendedor", AGENTE: "Agente", ADMIN: "Admin" };
const normalizeUser = (user) => ({ ...user, role: ROLE_DISPLAY[user.role] || user.role });

// El JWT ya NO se guarda acá — vive en una cookie httpOnly que pone el
// backend (ver setAuthCookie en el server) y que JS no puede leer. Esto es
// a propósito: si algún día hay un XSS, no tiene nada que robar en
// localStorage. Solo cacheamos el perfil (no sensible) para pintar la UI
// al instante mientras se revalida la sesión real contra /api/auth/me.
const saveSession  = (user) => localStorage.setItem("domify-session", JSON.stringify(user));
const clearSession = () => localStorage.removeItem("domify-session");
const loadSession = () => {
  try { const u = localStorage.getItem("domify-session"); return u ? JSON.parse(u) : null; }
  catch { return null; }
};

// Toda request que cambia estado y se autentica con la cookie necesita este
// header — es la defensa contra CSRF del lado del backend (ver
// auth.middleware.js): un <form> de otro sitio no puede agregarlo.
export const CSRF_HEADERS = { "x-domify-client": "web" };

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSession);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);

  // Al arrancar: siempre revalidamos contra el backend, sin importar si
  // había algo en localStorage — la sesión real la decide la cookie
  // httpOnly, no lo que quedó cacheado en el navegador.
  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => {
        const user = normalizeUser(data.user);
        saveSession(user);
        setCurrentUser(user);
      })
      .catch((status) => {
        // Sin cookie válida (o expirada) — limpiar sesión
        if (status === 401 || status === 403) {
          clearSession();
          setCurrentUser(null);
        }
        // Cualquier otro error (red, servidor caído) — seguimos con sesión local
      });
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...CSRF_HEADERS },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Si hay errores de campo específicos, mostramos el primero
        const msg = data.fields?.[0]?.message || data.error || "Error al crear la cuenta.";
        setError(msg);
        return false;
      }
      const user = normalizeUser(data.user);
      saveSession(user);
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...CSRF_HEADERS },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.fields?.[0]?.message || data.error || "Correo o contraseña incorrectos.";
        setError(msg);
        return false;
      }
      const user = normalizeUser(data.user);
      saveSession(user);
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: CSRF_HEADERS,
      });
    } catch {
      // Si el backend no responde, igual limpiamos la sesión local.
    }
    clearSession();
    setCurrentUser(null);
  }, []);

  const updateAvatar = useCallback(async (file) => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res  = await fetch(`${API_URL}/api/auth/avatar`, {
        method: "POST",
        credentials: "include",
        headers: CSRF_HEADERS,
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al actualizar la foto de perfil.");
        return false;
      }
      const user = normalizeUser(data.user);
      saveSession(user);
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    }
  }, []);

  // ← Ya NO bloqueamos el render — la app carga inmediatamente
  // El rol se actualiza en segundo plano cuando /api/auth/me responde

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, error, setError, loading, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}