import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
// El backend devuelve type/status en MAYÚSCULAS (APARTAMENTO, VENTA...)
// El frontend los usa con mayúscula inicial (Apartamento, Venta...)
const TYPE_MAP  = { APARTAMENTO: "Apartamento", CASA: "Casa", VILLA: "Villa" };
const STATUS_MAP = { VENTA: "Venta", RENTA: "Renta", VENDIDO: "Vendido", RENTADO: "Rentado" };

const normalizeProperty = (p) => ({
  ...p,
  type:   TYPE_MAP[p.type]   || p.type,
  status: STATUS_MAP[p.status] || p.status,
  // El backend devuelve publishedBy como objeto { id, name, email }
  // lo dejamos tal cual — PropertyDetail ya sabe manejarlo
  image: p.images?.[0] || "",
});

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const { getToken } = useAuth();

  const [properties, setProperties]   = useState([]);
  const [favorites,  setFavorites]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("domusrd-favorites")) || []; }
    catch { return []; }
  });
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  // ── CARGAR PROPIEDADES DESDE EL BACKEND ──────────────────────────────────
  const fetchProperties = useCallback(async (city = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = city
        ? `${API_URL}/api/properties?city=${encodeURIComponent(city)}`
        : `${API_URL}/api/properties`;
      const res  = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar propiedades");
      setProperties(data.map(normalizeProperty));
    } catch (err) {
      console.error("fetchProperties error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // ── PUBLICAR PROPIEDAD ────────────────────────────────────────────────────
  const addProperty = useCallback(async (formData) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:       formData.title,
          description: formData.description,
          price:       formData.price,
          city:        formData.city,
          lat:         formData.lat,
          lng:         formData.lng,
          rooms:       formData.rooms,
          baths:       formData.baths,
          parking:     formData.parking,
          type:        (formData.type  || "Apartamento").toUpperCase(),
          status:      (formData.status || "Venta").toUpperCase(),
          images:      formData.images || [],
          userId:      formData.publishedById,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al publicar");
      const newProp = normalizeProperty(data.property);
      setProperties((prev) => [newProp, ...prev]);
      return newProp;
    } catch (err) {
      console.error("addProperty error:", err);
      throw err;
    }
  }, [getToken]);

  // ── ACTUALIZAR PROPIEDAD ──────────────────────────────────────────────────
  const updateProperty = useCallback(async (id, updates) => {
    const token = getToken();
    try {
      const payload = { ...updates };
      if (payload.type)   payload.type   = payload.type.toUpperCase();
      if (payload.status) payload.status = payload.status.toUpperCase();

      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      const updated = normalizeProperty(data.property);
      setProperties((prev) => prev.map((p) => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error("updateProperty error:", err);
      throw err;
    }
  }, [getToken]);

  // ── ELIMINAR PROPIEDAD ────────────────────────────────────────────────────
  const deleteProperty = useCallback(async (id) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar");
      }
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("deleteProperty error:", err);
      throw err;
    }
  }, [getToken]);

  // ── FAVORITOS (localStorage hasta que hagamos el paso 3) ─────────────────
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("domusrd-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  // ── QUERIES DERIVADAS ─────────────────────────────────────────────────────
  const getUserProperties = useCallback(
    (userId) => properties.filter((p) => {
      const ownerId = typeof p.publishedBy === "object"
        ? p.publishedBy?.id
        : p.publishedById;
      return ownerId === userId;
    }),
    [properties]
  );

  const getFavoriteProperties = useCallback(
    () => properties.filter((p) => favorites.includes(p.id)),
    [properties, favorites]
  );

  // verifyProperty sigue siendo local (hasta que haya un endpoint admin)
  const verifyProperty = useCallback((id) => {
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, verified: true } : p));
  }, []);

  return (
    <PropertiesContext.Provider value={{
      allProperties: properties,
      published:     properties,   // alias para compatibilidad con Publish.js
      favorites,
      loading,
      error,
      fetchProperties,
      addProperty,
      updateProperty,
      deleteProperty,
      toggleFavorite,
      isFavorite,
      getUserProperties,
      getFavoriteProperties,
      verifyProperty,
    }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}