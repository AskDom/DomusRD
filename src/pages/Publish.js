import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// =======================
// CONFIG ICONOS LEAFLET
// =======================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// =======================
// DATA INICIAL
// =======================
const initialProperties = [
  {
    id: 1,
    title: "Apartamento moderno en Santo Domingo",
    price: 120000,
    lat: 18.4861,
    lng: -69.9312,
    type: "Apartamento",
    rooms: 2,
    baths: 2,
    parking: 1,
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    liked: false,
  },
  {
    id: 2,
    title: "Casa familiar en Santiago",
    price: 250000,
    lat: 19.4517,
    lng: -70.6970,
    type: "Casa",
    rooms: 4,
    baths: 3,
    parking: 2,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    liked: false,
  },
  {
    id: 3,
    title: "Villa de lujo en Punta Cana",
    price: 450000,
    lat: 18.5601,
    lng: -68.3725,
    type: "Villa",
    rooms: 5,
    baths: 4,
    parking: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    liked: false,
  },
  {
    id: 4,
    title: "Penthouse en Naco",
    price: 320000,
    lat: 18.4720,
    lng: -69.9290,
    type: "Apartamento",
    rooms: 3,
    baths: 3,
    parking: 2,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    liked: false,
  },
  {
    id: 5,
    title: "Casa con piscina en La Romana",
    price: 390000,
    lat: 18.4273,
    lng: -68.9728,
    type: "Casa",
    rooms: 4,
    baths: 4,
    parking: 2,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    liked: false,
  },
  {
    id: 6,
    title: "Apartamento económico en San Cristóbal",
    price: 85000,
    lat: 18.4167,
    lng: -70.1000,
    type: "Apartamento",
    rooms: 2,
    baths: 1,
    parking: 1,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
    liked: false,
  },
  {
    id: 7,
    title: "Villa turística en Samaná",
    price: 550000,
    lat: 19.2056,
    lng: -69.3369,
    type: "Villa",
    rooms: 6,
    baths: 5,
    parking: 4,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    liked: false,
  },
  {
    id: 8,
    title: "Casa moderna en Baní",
    price: 175000,
    lat: 18.2796,
    lng: -70.3319,
    type: "Casa",
    rooms: 3,
    baths: 2,
    parking: 2,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    liked: false,
  }
];

function LocationSelector({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function App() {
  const [properties, setProperties] = useState(initialProperties);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    type: "Apartamento",
    status: "Venta",
    rooms: 1,
    baths: 1,
    parking: 1,
    image: "",
    lat: "",
    lng: ""

  });

  const [position, setPosition] = useState(null);

  // =======================
  // LIKE / FAVORITO
  // =======================
  const toggleLike = (id) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, liked: !p.liked } : p
    );
    setProperties(updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let lat = position?.lat;
    let lng = position?.lng;

    if (!lat || !lng) {
      if (!form.lat || !form.lng) return alert("Ubicación requerida");
      lat = parseFloat(form.lat);
      lng = parseFloat(form.lng);
    }

    const newProperty = {
      id: Date.now(),
      ...form,
      lat,
      lng,
      liked: false,
    };

    setProperties([...properties, newProperty]);

    setForm({
      title: "",
      price: "",
      description: "",
      type: "Apartamento",
      rooms: 1,
      baths: 1,
      parking: 1,
      image: "",
      lat: "",
      lng: ""
    });

    setPosition(null);
  };
    return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

    {/* NAVBAR PREMIUM */}
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-2">

          <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">
            🏠
          </div>

          <div>
            <h1 className="font-black text-xl leading-none">
              DomusRD
            </h1>

            <p className="text-xs text-gray-500">
              Publicar Propiedad
            </p>
          </div>

        </div>

        {/* MENU */}
        <div className="flex items-center gap-3">

          <button className="bg-white border border-gray-200 px-4 py-2 rounded-full hover:shadow-md transition">

          </button>

          <button className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-black transition">
            👤 Sign In
          </button>

        </div>

      </div>

    </div>

    {/* CONTENIDO */}
    <div className="p-4 md:p-6">

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* MAPA */}
        <div className="xl:col-span-2 space-y-6">

          <MapContainer
            center={[18.7357, -70.1627]}
            zoom={7.5}
            scrollWheelZoom={false}
            className="h-[450px] md:h-[500px] rounded-3xl shadow-xl"
            style={{ zIndex: 0 }}
          >

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {properties.map((prop) => (
              <Marker
                key={prop.id}
                position={[prop.lat, prop.lng]}
              >
                <Popup>
                  <strong>{prop.title}</strong>
                  <br />
                  ${prop.price}
                </Popup>
              </Marker>
            ))}

            <LocationSelector setPosition={setPosition} />

            {position && (
              <Marker position={position}>
                <Popup>Nueva propiedad</Popup>
              </Marker>
            )}

          </MapContainer>

        </div>

        {/* FORMULARIO PREMIUM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl p-6 space-y-5 h-fit"
        >

          <div>

            <h2 className="text-2xl font-black">
              Publicar propiedad
            </h2>

            <p className="text-gray-500 text-sm">
              Completa la información del inmueble
            </p>

          </div>

          {/* TITULO */}
          <input
            placeholder="Título de la propiedad"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PRECIO */}
          <input
            placeholder="Precio"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* STATUS */}
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3"
          >
            <option>Venta</option>
            <option>Renta</option>
          </select>

          {/* TIPO */}
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3"
          >
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Villa</option>
          </select>

          {/* SPECS */}
          <div className="grid grid-cols-3 gap-3">

            <select
              value={form.rooms}
              onChange={(e) =>
                setForm({ ...form, rooms: e.target.value })
              }
              className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3"
            >
              {[1,2,3,4,5].map((n) => (
                <option key={n}>
                  {n} hab
                </option>
              ))}
            </select>

            <select
              value={form.baths}
              onChange={(e) =>
                setForm({ ...form, baths: e.target.value })
              }
              className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3"
            >
              {[1,2,3,4].map((n) => (
                <option key={n}>
                  {n} baños
                </option>
              ))}
            </select>

            <select
              value={form.parking}
              onChange={(e) =>
                setForm({ ...form, parking: e.target.value })
              }
              className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3"
            >
              {[0,1,2,3].map((n) => (
                <option key={n}>
                  {n} parqueos
                </option>
              ))}
            </select>

          </div>

          {/* DESCRIPCION */}
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 h-28 resize-none outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* FOTO */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center bg-gray-50">

            <p className="text-sm text-gray-500 mb-2">
              📸 Subir imagen
            </p>

            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full"
            />

          </div>

          {/* UBICACION */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-gray-600">

            <p className="font-semibold mb-1">
              📍 Ubicación seleccionada
            </p>

            {position ? (
              <>
                <p>Lat: {position.lat.toFixed(4)}</p>
                <p>Lng: {position.lng.toFixed(4)}</p>
              </>
            ) : (
              <p>Pulsa en el mapa para seleccionar ubicación</p>
            )}

          </div>

          {/* BOTON */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold shadow-xl transition">
            Publicar propiedad
          </button>

        </form>

      </div>

      {/* FEED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {properties.map((prop) => (

          <div
            key={prop.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 relative"
          >

            {/* FAVORITO */}
            <button
              onClick={() => toggleLike(prop.id)}
              className="absolute top-3 right-3 z-20 text-xl"
            >
              {prop.liked ? "❤️" : "🤍"}
            </button>

            {/* STATUS */}
            <div className="absolute top-3 left-3 z-20 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
              {prop.status || "Venta"}
            </div>

            {/* FOTO */}
            {prop.image && (
              <img
                src={prop.image}
                alt={prop.title}
                className="w-full h-52 object-cover"
              />
            )}

            {/* INFO */}
            <div className="p-5">

              <h3 className="font-bold text-lg">
                {prop.title}
              </h3>

              <p className="text-blue-600 font-bold text-lg mt-1">
                ${prop.price}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {prop.type} • {prop.rooms} hab • {prop.baths} baños • {prop.parking} parqueos
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>
);
}