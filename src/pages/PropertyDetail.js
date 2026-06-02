import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import properties from "../data/properties";
import Navbar from "../components/Navbar";

export default function PropertyDetail() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Propiedad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      <Navbar />

      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Link to="/">
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition">
            ← Volver
          </button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-5">

        {/* GALERÍA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <img src={property.image} alt="property" className="w-full h-[400px] object-cover rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={property.image} alt="property" className="w-full h-[190px] object-cover rounded-2xl" />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 p-6 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">{property.status}</span>
              <h1 className="text-3xl font-bold mt-3 text-gray-900 dark:text-white">{property.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">📍 República Dominicana</p>
            </div>
            <button className="text-3xl">🤍</button>
          </div>

          <h2 className="text-2xl text-blue-600 dark:text-blue-400 font-bold mt-4">
            ${property.price?.toLocaleString()}
          </h2>

          <div className="flex gap-6 mt-4 text-gray-700 dark:text-gray-300 flex-wrap">
            <span>🛏️ {property.rooms} Habitaciones</span>
            <span>🛁 {property.baths} Baños</span>
            <span>🚗 {property.parking} Parqueos</span>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 p-6 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Descripción</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-7">{property.description}</p>
        </div>

        {/* AMENITIES */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 p-6 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Amenidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {property.amenities?.map((item, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl p-4 text-center transition-colors">
                ✅ {item}
              </div>
            ))}
          </div>
        </div>

        {/* MAPA */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 p-6 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ubicación</h2>
          <MapContainer center={[property.lat, property.lng]} zoom={14} className="h-[400px] rounded-2xl">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.lat, property.lng]}>
              <Popup>{property.title}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* CONTACTO */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 p-6 flex flex-wrap gap-4 justify-between items-center transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">¿Te interesa esta propiedad?</h2>
            <p className="text-gray-500 dark:text-gray-400">Contacta al vendedor directamente</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition">
              WhatsApp
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              Llamar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}