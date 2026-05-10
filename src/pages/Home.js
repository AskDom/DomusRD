import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import propertiesData from "../data/properties";
// =======================
// FIX ICONOS LEAFLET
// =======================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// =======================
// DATA (SIMULACIÓN)
// =======================

export default function Home() {
  // =======================
  // STATE PROPIEDADES
  // =======================
  const [properties, setProperties] = useState(propertiesData);
  const [loading, setLoading] = useState(true);

useEffect(() => {

  setTimeout(() => {
    setLoading(false);
  }, 2000);

}, []);
  // =======================
  // FILTROS
  // =======================
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    status: "",
  });

  // =======================
  // FAVORITOS
  // =======================
  const toggleLike = (id) => {
    setProperties(
      properties.map((p) =>
        p.id === id ? { ...p, liked: !p.liked } : p
      )
    );
  };

  // =======================
  // FILTRAR PROPIEDADES
  // =======================
  const filteredProperties = properties.filter((p) => {
    return (
      (!filters.type || p.type === filters.type) &&
      (!filters.rooms || p.rooms == filters.rooms) &&
      (!filters.minPrice || p.price >= filters.minPrice) &&
      (!filters.maxPrice || p.price <= filters.maxPrice) &&
      (!filters.status || p.status === filters.status)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* NAVBAR PREMIUM */}
<div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">

  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

    {/* LOGO */}
    <div className="flex items-center gap-2 cursor-pointer">

      <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">
        🏠
      </div>

      <div>
        <h1 className="font-black text-xl leading-none">
          DomusRD
        </h1>

        <p className="text-xs text-gray-500">
          Real Estate
        </p>
      </div>

    </div>

    {/* SEARCH */}
    <div className="hidden md:flex flex-1 max-w-2xl">

      <div className="w-full bg-white border border-gray-200 rounded-full shadow-sm px-4 py-3 flex items-center gap-3 hover:shadow-md transition">

        <span className="text-gray-400 text-lg">
          🔍
        </span>

        <input
          type="text"
          placeholder="Buscar ciudad, sector o propiedad..."
          className="w-full outline-none bg-transparent text-sm"
        />

      </div>

    </div>

    {/* MENU */}
    <div className="flex items-center gap-3">

      {/* LINKS */}
      <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-700">

        <button className="hover:text-blue-600 transition">
          Comprar
        </button>

        <button className="hover:text-blue-600 transition">
          Rentar
        </button>

        <button className="hover:text-blue-600 transition">
          Mapa
        </button>

      </div>

      {/* FAVORITOS */}
      <button className="relative bg-white border border-gray-200 px-4 py-2 rounded-full hover:shadow-md transition">

        ❤️

        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          2
        </span>

      </button>

      {/* PUBLICAR */}
      <Link to="/publish">

        <button className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md transition">

          + Publicar

        </button>

      </Link>

      {/* SIGN IN */}
      <button className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-black transition">

        👤 Sign In

      </button>

    </div>

  </div>

</div>

      {/* CONTENIDO */}
      <div className="p-4 md:p-6">

        {/* FILTER BAR PREMIUM */}
<div className="relative -mt-2 mb-8 z-40">

  <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-4">

    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

      {/* VENTA / RENTA */}
      <select
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Venta o renta</option>
        <option value="Venta">Venta</option>
        <option value="Renta">Renta</option>
      </select>

      {/* TIPO */}
      <select
        onChange={(e) =>
          setFilters({ ...filters, type: e.target.value })
        }
        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tipo de propiedad</option>
        <option>Apartamento</option>
        <option>Casa</option>
        <option>Villa</option>
      </select>

      {/* PRECIO */}
      <input
        type="number"
        placeholder="Precio máximo"
        onChange={(e) =>
          setFilters({ ...filters, maxPrice: e.target.value })
        }
        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* HABITACIONES */}
      <select
        onChange={(e) =>
          setFilters({ ...filters, rooms: e.target.value })
        }
        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Habitaciones</option>

        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select>

      {/* BOTON */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg transition">

        🔍 Buscar

      </button>

    </div>

  </div>

</div>

        {/* MAPA */}
        <div className="mb-6">

          <MapContainer
            center={[18.7357, -70.1627]}
            zoom={7}
            scrollWheelZoom={false}
            className="h-[300px] md:h-[450px] rounded-2xl shadow"
            style={{ zIndex: 0 }}
          >

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {filteredProperties.map((prop) => (
              <Marker
                key={prop.id}
                position={[prop.lat, prop.lng]}
              >
                <Popup>
                  {prop.title}
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        </div>

        {/* FEED */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

  {loading ? (

    [...Array(6)].map((_, index) => (

      <div
        key={index}
        className="bg-white rounded-2xl shadow overflow-hidden animate-pulse"
      >

        <div className="h-48 bg-gray-300"></div>

        <div className="p-4 space-y-3">

          <div className="h-4 bg-gray-300 rounded w-3/4"></div>

          <div className="h-4 bg-gray-200 rounded w-1/2"></div>

          <div className="h-3 bg-gray-200 rounded w-1/3"></div>

        </div>

      </div>

    ))

  ) : (

    filteredProperties.map((prop) => (

      <Link key={prop.id} to={`/property/${prop.id}`}>

        <div className="bg-white p-3 rounded-xl shadow relative hover:shadow-xl transition duration-300">

          {/* FAVORITO */}
          <button
            onClick={() => toggleLike(prop.id)}
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
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
            {prop.status}
          </div>

          {/* INFO */}
          <div className="mt-3">

            <h3 className="font-bold text-lg">
              {prop.title}
            </h3>

            <p className="text-blue-600 font-semibold text-lg">
              ${prop.price.toLocaleString()}
            </p>

            <p className="text-gray-500 text-sm mt-1">
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