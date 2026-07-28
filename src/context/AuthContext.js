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

  // Vuelve a pedir /me y refresca la sesión guardada (rol, emailVerified, etc).
  // Se usa al arrancar la app y después de verificar el correo.
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("domusrd-token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          clearSession();
          setCurrentUser(null);
        }
        return;
      }
      const data = await res.json();
      const user = normalizeUser(data.user);
      localStorage.setItem("domusrd-session", JSON.stringify(user));
      setCurrentUser(user);
    } catch {
      // Red caída o servidor no disponible — seguimos con la sesión local.
    }
  }, []);

  // Al arrancar: verificar token con backend para refrescar el rol.
  // Si falla, simplemente seguimos con la sesión guardada en localStorage.
  useEffect(() => {
    refreshUser();
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

  const updateAvatar = useCallback(async (file) => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res  = await fetch(`${API_URL}/api/auth/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al actualizar la foto de perfil.");
        return false;
      }
      const user = normalizeUser(data.user);
      localStorage.setItem("domusrd-session", JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch {
      setError("No se pudo conectar con el servidor.");
      return false;
    }
  }, [getToken]);

  const resendVerificationEmail = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.error || "No se pudo reenviar el correo." };
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, message: "No se pudo conectar con el servidor." };
    }
  }, [getToken]);

  // ← Ya NO bloqueamos el render — la app carga inmediatamente
  // El rol se actualiza en segundo plano cuando /api/auth/me responde

  return (
    <AuthContext.Provider value={{
      currentUser, login, register, logout, error, setError, loading, getToken, updateAvatar,
      refreshUser, resendVerificationEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}