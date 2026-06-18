import React, { createContext, useContext, useState, useEffect } from "react";

const PropertiesContext = createContext();
const API_URL = "http://localhost:5000/api/properties";

export function PropertiesProvider({ children }) {
  const [allProperties, setAllProperties] = useState([]);
  const [published, setPublished] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Mantener favoritos local de momento
    const localFavs = localStorage.getItem("domusrd-favorites");
    return localFavs ? JSON.parse(localFavs) : [];
  });

  // Guardar favoritos locales cada vez que cambien
  useEffect(() => {
    localStorage.setItem("domusrd-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ── 1. CARGAR PROPIEDADES DESDE EL BACKEND (GET) ──────────────────
  const fetchProperties = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al traer propiedades");
      const data = await response.json();
      
      setAllProperties(data);
      // Filtramos las publicadas simulando las del usuario si es necesario, 
      // o dejamos que el backend se encargue mediante getUserProperties
      setPublished(data); 
    } catch (error) {
      console.error("Error cargando backend:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Función auxiliar para obtener el token guardado en el login
  const getAuthHeader = () => {
    const token = localStorage.getItem("domusrd-token"); // Ajusta el nombre si en tu AuthContext usas otro
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  // ── 2. CREAR PROPIEDAD (POST + TOKEN) ─────────────────────────────
  const addProperty = async (property) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) throw new Error("No se pudo crear la propiedad");
      const newProp = await response.json();
      
      // Actualizamos el estado de inmediato en la UI
      setAllProperties((prev) => [newProp, ...prev]);
      return newProp;
    } catch (error) {
      console.error(error);
    }
  };

  // ── 3. ACTUALIZAR PROPIEDAD (PUT + TOKEN) ─────────────────────────
  const updateProperty = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("No se pudo actualizar la propiedad");
      const updatedProp = await response.json();

      // Sincronizar estados locales
      const updateState = (prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedProp } : p));
      setAllProperties(updateState);
      setPublished(updateState);
    } catch (error) {
      console.error(error);
    }
  };

  // ── 4. ELIMINAR PROPIEDAD (DELETE + TOKEN) ───────────────────────
  const deleteProperty = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) throw new Error("No se pudo eliminar la propiedad");

      // Remover del estado de la UI
      const filterState = (prev) => prev.filter((p) => p.id !== id);
      setAllProperties(filterState);
      setPublished(filterState);
    } catch (error) {
      console.error(error);
    }
  };

  // ── FUNCIONES AUXILIARES DE LA UI ──────────────────────────────────
  const verifyProperty = (id) => {
    // Si tu backend tiene ruta para verificar, harías un fetch aquí. Si no, lo dejamos local:
    const updateVerify = (prev) => prev.map((p) => p.id === id ? { ...p, verified: true } : p);
    setAllProperties(updateVerify);
    setPublished(updateVerify);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  const getUserProperties = (userId) => 
    allProperties.filter((p) => p.userId === userId || p.publishedById === userId);

  const getFavoriteProperties = () =>
    allProperties.filter((p) => favorites.includes(p.id));

  return (
    <PropertiesContext.Provider value={{
      allProperties, published, favorites,
      addProperty, verifyProperty, updateProperty, deleteProperty,
      toggleFavorite, isFavorite,
      getUserProperties, getFavoriteProperties,
    }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}