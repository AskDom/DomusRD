import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import properties from "../data/properties";
import Navbar from "../components/Navbar";

// Imágenes extra por tipo de propiedad para simular galería real
const extraImages = {
  Apartamento: [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
  ],
  Casa: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  ],
  Villa: [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
  ],
};

export default function PropertyDetail() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));
  const [lightbox, setLightbox] = useState(null); // índice imagen abierta
  const [liked, setLiked] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Propiedad no encontrada</p>
      </div>
    );
  }

  const gallery = [property.image, ...(extraImages[property.type] || [])];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      <Navbar />

      {/* BACK */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Link to="/">
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition">
            ← Volver
          </button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-5">

        {/* ── GALERÍA ── */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-3xl overflow-hidden">
          {/* Foto principal grande */}
          <div
            className="col-span-2 row-span-2 cursor-pointer overflow-hidden"
            onClick={() => setLightbox(0)}
          >
            <img
              src={gallery[0]}
              alt="main"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* 4 fotos pequeñas */}
          {gallery.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative cursor-pointer overflow-hidden"
              onClick={() => setLightbox(i + 1)}
            >
              <img
                src={img}
                alt={`photo-${i}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {/* overlay "ver todas" en la última */}
              {i === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📷 Ver todas</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── LIGHTBOX ── */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
              onClick={() => setLightbox(null)}
            >✕</button>
            <button
              className="absolute left-4 text-white text-4xl hover:text-gray-300 px-4"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}
            >‹</button>
            <img
              src={gallery[lightbox]}
              alt="lightbox"
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 text-white text-4xl hover:text-gray-300 px-4"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}
            >›</button>
            <p className="absolute bottom-4 text-white text-sm opacity-60">
              {lightbox + 1} / {gallery.length}
            </p>
          </div>
        )}

        {/* ── INFO PRINCIPAL ── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-6 transition-colors">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  property.status === "Venta" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                }`}>
                  {property.status}
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-semibold">
                  {property.type}
                </span>
              </div>
              <h1 className="text-3xl font-black mt-3 text-gray-900 dark:text-white">{property.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">📍 República Dominicana</p>
            </div>
            <button
              onClick={() => setLiked(!liked)}
              className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            >
              {liked ? "❤️" : "🤍"}
            </button>
          </div>

          <p className="text-3xl text-blue-600 dark:text-blue-400 font-black mt-5">
            ${property.price?.toLocaleString()}
            {property.status === "Renta" && <span className="text-base font-normal text-gray-400 ml-1">/mes</span>}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: "🛏️", label: "Habitaciones", value: property.rooms },
              { icon: "🛁", label: "Baños", value: property.baths },
              { icon: "🚗", label: "Parqueos", value: property.parking },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 text-center transition-colors">
                <p className="text-2xl">{item.icon}</p>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DESCRIPCIÓN ── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-6 transition-colors">
          <h2 className="text-xl font-black mb-3 text-gray-900 dark:text-white">Descripción</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-7">{property.description}</p>
        </div>

        {/* ── AMENIDADES ── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-6 transition-colors">
          <h2 className="text-xl font-black mb-4 text-gray-900 dark:text-white">Amenidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {property.amenities?.map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl p-4 text-center text-sm font-medium transition-colors">
                ✅ {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── MAPA ── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-6 transition-colors">
          <h2 className="text-xl font-black mb-4 text-gray-900 dark:text-white">Ubicación</h2>
          <MapContainer center={[property.lat, property.lng]} zoom={14} className="h-[350px] rounded-2xl">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.lat, property.lng]}>
              <Popup>{property.title}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* ── CONTACTO ── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-6 flex flex-wrap gap-4 justify-between items-center transition-colors">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">¿Te interesa esta propiedad?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Contacta al vendedor directamente</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center gap-2">
              💬 WhatsApp
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center gap-2">
              📞 Llamar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}