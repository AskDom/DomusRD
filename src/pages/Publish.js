import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar";
import { useProperties } from "../context/PropertiesContext";
import { useAuth } from "../context/AuthContext";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LocationSelector({ setPosition }) {
  useMapEvents({
    click(e) { setPosition(e.latlng); },
  });
  return null;
}

const inputClass =
  "w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 transition-colors";

const selectClass =
  "w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 outline-none text-gray-800 dark:text-gray-100 transition-colors";

export default function Publish() {
  const { allProperties, addProperty } = useProperties();
  const { currentUser } = useAuth();
  const [position, setPosition] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "", price: "", description: "",
    type: "Apartamento", status: "Venta",
    rooms: 1, baths: 1, parking: 1,
    image: "", lat: "", lng: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let lat = position?.lat;
    let lng = position?.lng;
    if (!lat || !lng) return alert("Selecciona una ubicación en el mapa");
    addProperty({
      ...form,
      lat,
      lng,
      liked: false,
      city: form.title,
      publishedBy: currentUser?.name || "Anónimo",
    });
    setForm({ title: "", price: "", description: "", type: "Apartamento", status: "Venta", rooms: 1, baths: 1, parking: 1, image: "", lat: "", lng: "" });
    setPosition(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Publicar propiedad</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Selecciona la ubicación en el mapa y completa el formulario</p>
        </div>

        {/* MAPA — ARRIBA, ANCHO COMPLETO */}
        <div className="relative">
          <div className="absolute bottom-3 right-3 z-10 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full shadow border border-gray-200 dark:border-gray-600">
            📍 {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "Haz clic en el mapa para ubicar"}
          </div>
          <MapContainer
            center={[18.7357, -70.1627]}
            zoom={7}
            scrollWheelZoom={false}
            className="w-full h-[420px] rounded-3xl shadow-xl"
            style={{ zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {allProperties.map((prop) => (
              <Marker key={prop.id} position={[prop.lat, prop.lng]}>
                <Popup><strong>{prop.title}</strong><br />${prop.price?.toLocaleString()}</Popup>
              </Marker>
            ))}
            <LocationSelector setPosition={setPosition} />
            {position && (
              <Marker position={position}>
                <Popup>📍 Nueva propiedad aquí</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* FORMULARIO — ABAJO EN GRID */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 md:p-8 transition-colors duration-300"
        >
          {/* SUCCESS BANNER */}
          {submitted && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-2xl px-5 py-4 font-semibold flex items-center gap-2">
              ✅ ¡Propiedad publicada con éxito!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* TITULO */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Título de la propiedad</label>
              <input
                placeholder="Ej. Apartamento moderno en Piantini"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            {/* PRECIO */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Precio (USD)</label>
              <input
                type="number"
                placeholder="Ej. 150000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Operación</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
                <option>Venta</option>
                <option>Renta</option>
              </select>
            </div>

            {/* TIPO */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Tipo de propiedad</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Villa</option>
              </select>
            </div>

            {/* SPECS */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Características</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} className={selectClass}>
                  {[1,2,3,4,5].map((n) => <option key={n}>{n} hab</option>)}
                </select>
                <select value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} className={selectClass}>
                  {[1,2,3,4].map((n) => <option key={n}>{n} baños</option>)}
                </select>
                <select value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })} className={selectClass}>
                  {[0,1,2,3].map((n) => <option key={n}>{n} parq.</option>)}
                </select>
              </div>
            </div>

            {/* DESCRIPCION */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Descripción</label>
              <textarea
                placeholder="Describe la propiedad: acabados, ubicación, ventajas..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} h-28 resize-none`}
              />
            </div>

            {/* FOTO */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Imagen principal</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-center bg-gray-50 dark:bg-gray-700 transition-colors">
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-full h-28 object-cover rounded-xl mb-2" />
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-400 mb-2">📸 Sube una foto</p>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 dark:text-gray-400" />
              </div>
            </div>

          </div>

          {/* BOTON SUBMIT */}
          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition text-base"
            >
              🚀 Publicar propiedad
            </button>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {position ? "✅ Ubicación seleccionada" : "⚠️ Falta seleccionar ubicación en el mapa"}
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}