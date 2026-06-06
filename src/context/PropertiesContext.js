import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import mockProperties from "../data/properties";

const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const [published, setPublished] = useLocalStorage("domusrd-properties", []);
  const [favorites, setFavorites] = useLocalStorage("domusrd-favorites", []);

  const allProperties = [...mockProperties, ...published];

  const addProperty = (property) => {
    const newProp = { ...property, id: Date.now(), isUserPublished: true };
    setPublished((prev) => [newProp, ...prev]);
    return newProp;
  };

  const updateProperty = (id, updates) => {
    setPublished((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProperty = (id) => {
    setPublished((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFavorite = (id) => {
    const numId = Number(id);
    setFavorites((prev) =>
      prev.includes(numId) ? prev.filter((f) => f !== numId) : [...prev, numId]
    );
  };

  const isFavorite = (id) => favorites.includes(Number(id));

  const getUserProperties = (userId) =>
    published.filter((p) => p.publishedById === userId);

  const getFavoriteProperties = () =>
    allProperties.filter((p) => favorites.includes(Number(p.id)));

  return (
    <PropertiesContext.Provider value={{
      allProperties, published, favorites,
      addProperty, updateProperty, deleteProperty,
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