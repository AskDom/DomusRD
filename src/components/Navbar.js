import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";

export default function Navbar({ favoritesCount = 0 }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">
              🏠
            </div>
            <div>
              <h1 className="font-black text-xl leading-none">DomusRD</h1>
              <p className="text-xs text-gray-500">Real Estate</p>
            </div>
          </Link>

          {/* SEARCH — solo en Home */}
          {location.pathname === "/" && (
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="w-full bg-white border border-gray-200 rounded-full shadow-sm px-4 py-3 flex items-center gap-3 hover:shadow-md transition">
                <span className="text-gray-400 text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar ciudad, sector o propiedad..."
                  className="w-full outline-none bg-transparent text-sm"
                />
              </div>
            </div>
          )}

          {/* MENU DESKTOP */}
          <div className="flex items-center gap-3">

            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-700">
              <Link
                to="/"
                className={`hover:text-blue-600 transition ${
                  isActive("/") ? "text-blue-600 font-semibold" : ""
                }`}
              >
                Inicio
              </Link>
              <button className="hover:text-blue-600 transition">Comprar</button>
              <button className="hover:text-blue-600 transition">Rentar</button>
            </div>

            {/* FAVORITOS */}
            <button className="relative bg-white border border-gray-200 px-4 py-2 rounded-full hover:shadow-md transition">
              ❤️
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* PUBLICAR */}
            <Link to="/publish">
              <button
                className={`hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full font-medium shadow-md transition ${
                  isActive("/publish")
                    ? "bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                + Publicar
              </button>
            </Link>

            {/* SIGN IN */}
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-black transition"
            >
              👤 Sign In
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="lg:hidden bg-white border border-gray-200 px-3 py-2 rounded-full hover:shadow-md transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition py-1"
            >
              🏠 Inicio
            </Link>
            <button className="text-left text-sm font-medium text-gray-700 hover:text-blue-600 transition py-1">
              🛒 Comprar
            </button>
            <button className="text-left text-sm font-medium text-gray-700 hover:text-blue-600 transition py-1">
              🔑 Rentar
            </button>
            <Link
              to="/publish"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-blue-600 text-white text-center px-5 py-2.5 rounded-full font-medium shadow-md transition"
            >
              + Publicar propiedad
            </Link>
          </div>
        )}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}