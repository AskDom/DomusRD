import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import mockProperties from "../data/properties";

const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const [published, setPublished] = useLocalStorage("domusrd-properties", []);
  const [favorites, setFavorites] = useLocalStorage("domusrd-favorites", []);

  // Combina mock data + propiedades publicadas por usuarios
  const allProperties = [...mockProperties, ...published];

  const addProperty = (property) => {
    const newProp = { ...property, id: Date.now(), isUserPublished: true };
    setPublished((prev) => [newProp, ...prev]);
    return newProp;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <PropertiesContext.Provider value={{
      allProperties,
      published,
      favorites,
      addProperty,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}