import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import propertiesData from "../data/properties";
import Navbar from "../components/Navbar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function Home() {
  const [properties, setProperties] = useState(propertiesData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const [filters, setFilters] = useState({
    type: "", minPrice: "", maxPrice: "", rooms: "", status: "",
  });

  const toggleLike = (id) => {
    setProperties(properties.map((p) => p.id === id ? { ...p, liked: !p.liked } : p));
  };

  const filteredProperties = properties.filter((p) => {
    return (
      (!filters.type || p.type === filters.type) &&
      (!filters.rooms || p.rooms === filters.rooms) &&
      (!filters.minPrice || p.price >= filters.minPrice) &&
      (!filters.maxPrice || p.price <= filters.maxPrice) &&
      (!filters.status || p.status === filters.status)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">

      <Navbar favoritesCount={properties.filter((p) => p.liked).length} />

      <div className="p-4 md:p-6">

        {/* FILTER BAR */}
        <div className="relative -mt-2 mb-8 z-40">
          <div className="max-w-6xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-4 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

              <select
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Venta o renta</option>
                <option value="Venta">Venta</option>
                <option value="Renta">Renta</option>
              </select>

              <select
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Tipo de propiedad</option>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Villa</option>
              </select>

              <input
                type="number"
                placeholder="Precio máximo"
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />

              <select
                onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Habitaciones</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
              </select>

              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg transition">
                🔍 Buscar
              </button>

            </div>
          </div>
        </div>

        {/* MAPA */}
        <div className="relative mb-6">
          <MapContainer
            center={[18.7357, -70.1627]}
            zoom={7}
            scrollWheelZoom={false}
            className="w-full h-[420px] rounded-3xl shadow-xl"
            style={{ zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredProperties.map((prop) => (
              <Marker key={prop.id} position={[prop.lat, prop.lng]}>
                <Popup>{prop.title}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* FEED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden animate-pulse transition-colors">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : (
            filteredProperties.map((prop) => (
              <Link key={prop.id} to={`/property/${prop.id}`}>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow relative hover:shadow-xl transition duration-300 border border-transparent dark:border-gray-700">

                  {/* FAVORITO */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleLike(prop.id); }}
                    className="absolute top-2 right-2 text-lg z-20"
                  >
                    {prop.liked ? "❤️" : "🤍"}
                  </button>

                  {/* IMAGEN */}
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />

                  {/* STATUS */}
                  <div className="absolute top-3 left-3 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-1 rounded-full text-sm font-semibold shadow">
                    {prop.status}
                  </div>

                  {/* INFO */}
                  <div className="mt-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{prop.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">${prop.price.toLocaleString()}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {prop.rooms} hab • {prop.baths} baños • {prop.parking} parqueos
                    </p>
                  </div>

                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}