import React, { useState } from "react";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      {/* MODAL */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-black">
                Bienvenido
              </h2>

              <p className="text-gray-500 text-sm">
                Accede a tu cuenta de DomusRD
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-black transition"
            >
              ×
            </button>

          </div>

        </div>

        {/* TABS */}
        <div className="flex p-2 bg-gray-100 m-4 rounded-2xl">

          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-2xl font-semibold transition ${
              isLogin
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-2xl font-semibold transition ${
              !isLogin
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
          >
            Crear cuenta
          </button>

        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">

          {/* NOMBRE */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* USER TYPE */}
          {!isLogin && (
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            >
              <option>Cliente</option>
              <option>Agente</option>
              <option>Vendedor</option>
            </select>
          )}

          {/* EXTRA */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-500">

              <input type="checkbox" />

              Recordarme

            </label>

            <button className="text-blue-600 hover:underline">
              ¿Olvidaste contraseña?
            </button>

          </div>

          {/* BOTON */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold shadow-lg transition"
          >
            {isLogin
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 py-2">

            <div className="flex-1 h-px bg-gray-200"></div>

            <span className="text-sm text-gray-400">
              o continuar con
            </span>

            <div className="flex-1 h-px bg-gray-200"></div>

          </div>

          {/* SOCIAL */}
          <div className="grid grid-cols-2 gap-3">

            <button
              className="border border-gray-200 rounded-2xl py-3 hover:bg-gray-50 transition"
            >
              Google
            </button>

            <button
              className="border border-gray-200 rounded-2xl py-3 hover:bg-gray-50 transition"
            >
              Apple
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}