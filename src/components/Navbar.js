import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertiesContext";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { dark, toggleDark } = useTheme();
  const { currentUser, logout } = useAuth();
  const { favorites } = useProperties();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">🏠</div>
            <div>
              <h1 className="font-black text-xl leading-none text-gray-900 dark:text-white">DomusRD</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Real Estate</p>
            </div>
          </Link>

          {/* SEARCH — solo en Home */}
          {location.pathname === "/" && (
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full shadow-sm px-4 py-2.5 flex items-center gap-3 hover:shadow-md transition">
                <span className="text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar ciudad, sector o propiedad..."
                  className="w-full outline-none bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex items-center gap-2">

            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              <Link to="/" className={`hover:text-blue-500 transition ${isActive("/") ? "text-blue-600 font-semibold" : ""}`}>Inicio</Link>
              <button className="hover:text-blue-500 transition">Comprar</button>
              <button className="hover:text-blue-500 transition">Rentar</button>
            </div>

            {/* DARK MODE */}
            <button
              onClick={toggleDark}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:shadow-md transition"
              title={dark ? "Modo claro" : "Modo oscuro"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* FAVORITOS */}
            <button className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:shadow-md transition">
              ❤️
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* PUBLICAR */}
            <Link to="/publish">
              <button className={`hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full font-medium shadow-md transition ${isActive("/publish") ? "bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                + Publicar
              </button>
            </Link>

            {/* USER */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:opacity-80 transition font-medium"
                >
                  <span className="text-sm">👤 {currentUser.name.split(" ")[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                      <p className="text-xs text-blue-500 mt-0.5">{currentUser.role}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:opacity-80 transition font-medium"
              >
                👤 Sign In
              </button>
            )}

            {/* MOBILE TOGGLE */}
            <button
              className="lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:shadow-md transition text-gray-700 dark:text-gray-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300 py-1">🏠 Inicio</Link>
            <button className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 py-1">🛒 Comprar</button>
            <button className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 py-1">🔑 Rentar</button>
            <Link to="/publish" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white text-center px-5 py-2.5 rounded-full font-medium">
              + Publicar propiedad
            </Link>
            {currentUser && (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-sm font-medium text-red-500 py-1">
                🚪 Cerrar sesión
              </button>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}