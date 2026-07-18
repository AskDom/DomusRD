import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
const loadSession = () => {
  try { const u = localStorage.getItem("domusrd-session"); return u ? JSON.parse(u) : null; }
  catch { return null; }
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSession);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);

  // Al arrancar: verificar token con backend para refrescar el rol
  // Si falla, simplemente seguimos con la sesión guardada en localStorage
  useEffect(() => {
    const token = localStorage.getItem("domusrd-token");
    if (!token) return;

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data) => {
        const user = normalizeUser(data.user);
        localStorage.setItem("domusrd-session", JSON.stringify(user));
        setCurrentUser(user);
      })
      .catch((status) => {
        // Token expirado o inválido — limpiar sesión
        if (status === 401 || status === 403) {
          clearSession();
          setCurrentUser(null);
        }
        // Cualquier otro error (red, servidor caído) — seguimos con sesión local
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      saveSession(data.token, user);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.fields?.[0]?.message || data.error || "Correo o contraseña incorrectos.";
        setError(msg);
        return false;
      }
      const user = normalizeUser(data.user);
      saveSession(data.token, user);
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("domusrd-token"), []);

  // ← Ya NO bloqueamos el render — la app carga inmediatamente
  // El rol se actualiza en segundo plano cuando /api/auth/me responde

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, error, setError, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}