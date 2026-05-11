import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import properties from "../data/properties";


export default function PropertyDetail() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams();

  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return <div>Propiedad no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-xl">BienesRaicesRD</h1>

        <Link to="/">
          <button className="bg-gray-200 px-4 py-2 rounded-xl">
            Volver
          </button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">

        {/* GALERÍA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">

          <div className="md:col-span-2">
            <img
              src={property.image} alt="property"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <img
              src={property.image} alt="property"
              className="w-full h-[190px] object-cover rounded-2xl"
            />
            <img
              src={property.image} alt="property"
              className="w-full h-[190px] object-cover rounded-2xl"
            />
            <img
              src={property.image} alt="property"
              className="w-full h-[190px] object-cover rounded-2xl"
            />
            <img
              src={property.image} alt="property"
              className="w-full h-[190px] object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <div className="flex justify-between items-start">

            <div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                {property.status}
              </span>

              <h1 className="text-3xl font-bold mt-3">
                {property.title}
              </h1>

              <p className="text-gray-500">
                📍 República Dominicana
              </p>
            </div>

            <button className="text-3xl">🤍</button>
          </div>

          <h2 className="text-2xl text-blue-600 font-bold mt-4">
            ${property.price}
          </h2>

          <div className="flex gap-6 mt-4 text-gray-700 flex-wrap">
            <span>🛏️ {property.rooms} Habitaciones</span>
            <span>🛁 {property.baths} Baños</span>
            <span>🚗 {property.parking} Parqueos</span>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Descripción
          </h2>

          <p className="text-gray-600 leading-7">
            {property.description}
          </p>
        </div>

        {/* AMENITIES */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Amenidades
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {property.amenities.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-4 text-center"
              >
                ✅ {item}
              </div>
            ))}
          </div>
        </div>

        {/* MAPA */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Ubicación
          </h2>

          <MapContainer
            center={[property.lat, property.lng]}
            zoom={14}
            className="h-[400px] rounded-2xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={[property.lat, property.lng]}>
              <Popup>{property.title}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* CONTACTO */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap gap-4 justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">
              ¿Te interesa esta propiedad?
            </h2>

            <p className="text-gray-500">
              Contacta al vendedor directamente
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-green-500 text-white px-6 py-3 rounded-xl">
              WhatsApp
            </button>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Llamar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}