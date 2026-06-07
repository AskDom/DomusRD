import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertiesContext";
import { useInbox } from "../context/InboxContext";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { dark, toggleDark } = useTheme();
  const { currentUser, logout } = useAuth();
  const { favorites } = useProperties();
  const { getUnreadCount } = useInbox();
  const unread = currentUser ? getUnreadCount(currentUser.id) : 0;

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 shadow-md transition-colors duration-300">

        {/* FILA PRINCIPAL */}
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">🏠</div>
            <div>
              <h1 className="font-black text-xl leading-none text-gray-900 dark:text-white">DomusRD</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Real Estate</p>
            </div>
          </Link>

          {/* ACCIONES */}
          <div className="flex items-center gap-2">

            {/* DARK MODE */}
            <button
              onClick={toggleDark}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:shadow-md transition"
              title={dark ? "Modo claro" : "Modo oscuro"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* INBOX */}
            {currentUser && (
              <Link to="/inbox">
                <button className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:shadow-md transition">
                  ✉️
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>
              </Link>
            )}

            {/* FAVORITOS */}
            <Link to="/favorites">
              <button className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-full hover:shadow-md transition">
                ❤️
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </Link>

            {/* PUBLICAR — solo Agentes y Vendedores */}
            {currentUser && ["Agente", "Vendedor"].includes(currentUser.role) && (
              <Link to="/publish">
                <button className={`hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full font-medium shadow-md transition ${location.pathname === "/publish" ? "bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                  + Publicar
                </button>
              </Link>
            )}

            {/* PUBLICAR para no logueados */}
            {!currentUser && (
              <Link to="/publish">
                <button className="hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full font-medium shadow-md transition bg-blue-600 hover:bg-blue-700 text-white">
                  + Publicar
                </button>
              </Link>
            )}

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
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                      <p className={`text-xs mt-0.5 font-semibold ${
                        currentUser.role === "Agente" ? "text-yellow-500" :
                        currentUser.role === "Vendedor" ? "text-green-500" :
                        "text-blue-500"
                      }`}>
                        {currentUser.role === "Agente" ? "⭐ Agente" :
                         currentUser.role === "Vendedor" ? "🏠 Vendedor" :
                         "👤 Cliente"}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      👤 Mi perfil
                    </Link>
                    <Link
                      to="/profile?tab=propiedades"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      🏠 Mis propiedades
                    </Link>
                    <Link
                      to="/profile?tab=favoritos"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      ❤️ Favoritos
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
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
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300 py-2">🏠 Inicio</Link>
            {currentUser && (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300 py-2">👤 Mi perfil</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-sm font-medium text-red-500 py-2">🚪 Cerrar sesión</button>
              </>
            )}
            <Link to="/publish" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white text-center px-5 py-2.5 rounded-full font-medium mt-1">
              + Publicar propiedad
            </Link>
          </div>
        )}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}