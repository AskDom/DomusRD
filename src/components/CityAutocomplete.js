import { useEffect, useRef, useState } from "react";
import { DOMINICAN_CITIES } from "../data/dominicanCities";

// Combobox de ciudad: se puede escribir para filtrar, pero solo queda
// confirmado el valor si se elige una opción de la lista (o si lo escrito
// coincide exacto con una, sin importar mayúsculas, al salir del campo) —
// evita ciudades con errores de tipeo o acentos inconsistentes ("Samana"
// vs "Samaná") que después no se pueden buscar/filtrar bien.
export default function CityAutocomplete({ value, onChange, className, error, placeholder = "Escribí para buscar..." }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => setQuery(value || ""), [value]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Sin límite artificial: el contenedor de abajo ya scrollea (max-h-56),
  // y con ~50 opciones cortar en 8 escondía casi toda la lista sin escribir
  // nada primero (arrancando en A/B, no se veían Santiago/Santo Domingo/etc).
  const suggestions = query.trim()
    ? DOMINICAN_CITIES.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()))
    : DOMINICAN_CITIES;

  const select = (city) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  const handleBlur = () => {
    const exact = DOMINICAN_CITIES.find((c) => c.toLowerCase() === query.trim().toLowerCase());
    if (exact) {
      setQuery(exact);
      onChange(exact);
    }
    // Delay corto para que el click en una opción (onMouseDown más abajo)
    // alcance a registrarse antes de que el blur cierre la lista.
    setTimeout(() => setOpen(false), 120);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // no queda confirmada hasta elegir de la lista
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        className={`${className} ${error ? "ring-2 ring-red-400 border-red-300" : ""}`}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
          {suggestions.map((c) => (
            <button
              type="button"
              key={c}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(c)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
