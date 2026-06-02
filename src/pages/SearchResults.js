import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useProperties } from "../context/PropertiesContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Centra el mapa cuando cambian los resultados
function MapFocus({ properties }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 1) {
      map.setView([properties[0].lat, properties[0].lng], 13, { animate: true });
    } else if (properties.length > 1) {
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [properties, map]);
  return null;
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState(null);
  const [filters, setFilters] = useState({ status: "", type: "", rooms: "" });
  const { allProperties, toggleFavorite, isFavorite } = useProperties();
  const query = searchParams.get("q") || "";

  // Filtra por query + filtros adicionales
  const results = allProperties.filter((p) => {
    const q = query.toLowerCase();
    const matchQuery = q === "" || q === "república dominicana"
      ? true
      : p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
    const matchStatus = !filters.status || p.status === filters.status;
    const matchType = !filters.type || p.type === filters.type;
    const matchRooms = !filters.rooms || p.rooms === Number(filters.rooms);
    return matchQuery && matchStatus && matchType && matchRooms;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />

      {/* ── BARRA DE BÚSQUEDA + FILTROS ── */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-wrap items-center gap-3 z-40">

        {/* SEARCH INPUT */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 gap-2 flex-1 min-w-[200px] max-w-sm">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            defaultValue={query}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearchParams({ q: e.target.value });
            }}
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 w-full"
          />
        </div>

        {/* FILTROS */}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2 text-sm outline-none"
        >
          <option value="">Venta o Renta</option>
          <option value="Venta">Venta</option>
          <option value="Renta">Renta</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2 text-sm outline-none"
        >
          <option value="">Tipo</option>
          <option>Apartamento</option>
          <option>Casa</option>
          <option>Villa</option>
        </select>

        <select
          value={filters.rooms}
          onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2 text-sm outline-none"
        >
          <option value="">Habitaciones</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} hab</option>)}
        </select>

        <span className="text-gray-400 dark:text-gray-500 text-sm ml-auto">
          {results.length} resultado{results.length !== 1 ? "s" : ""} para <strong className="text-gray-700 dark:text-gray-200">"{query}"</strong>
        </span>
      </div>

      {/* ── LAYOUT DOS COLUMNAS ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>

        {/* CARDS — izquierda scrolleable */}
        <div className="w-full lg:w-[48%] overflow-y-auto px-4 py-5">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 dark:text-gray-400 font-semibold">No encontramos propiedades para "{query}"</p>
              <p className="text-gray-400 text-sm mt-1">Intenta con otro sector o provincia</p>
              <Link to="/" className="mt-4 text-blue-600 text-sm font-semibold hover:underline">← Volver al inicio</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((prop) => (
                <Link key={prop.id} to={`/property/${prop.id}`}>
                  <div
                    onMouseEnter={() => setActiveId(prop.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-200 border-2 cursor-pointer ${
                      activeId === prop.id
                        ? "border-blue-500 shadow-xl scale-[1.01]"
                        : "border-transparent shadow-sm hover:shadow-lg dark:border-gray-700"
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          prop.status === "Venta" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                        }`}>{prop.status}</span>
                        <span className="bg-white/90 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {prop.type}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center shadow text-xs hover:scale-110 transition-transform"
                      >
                        {isFavorite(prop.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{prop.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-black text-base mt-1">
                        ${prop.price.toLocaleString()}
                        {prop.status === "Renta" && <span className="text-xs font-normal text-gray-400">/mes</span>}
                      </p>
                      <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-gray-400 text-xs">
                        <span>🛏️ {prop.rooms}</span>
                        <span>🛁 {prop.baths}</span>
                        <span>🚗 {prop.parking}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* MAPA — derecha sticky */}
        <div className="hidden lg:block flex-1 relative">
          <MapContainer
            center={[18.7357, -70.1627]}
            zoom={7}
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapFocus properties={results} />
            {results.map((prop) => (
              <Marker
                key={prop.id}
                position={[prop.lat, prop.lng]}
                opacity={activeId === null || activeId === prop.id ? 1 : 0.4}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{prop.title}</p>
                    <p className="text-blue-600 font-semibold">${prop.price.toLocaleString()}</p>
                    <p className="text-gray-500">{prop.status} · {prop.type}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}