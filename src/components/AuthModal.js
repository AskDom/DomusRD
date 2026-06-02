import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Cliente" });
  const { login, register, error, setError } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = () => {
    const success = isLogin
      ? login({ email: form.email, password: form.password })
      : register({ name: form.name, email: form.email, password: form.password, role: form.role });
    if (success) {
      onClose();
      setForm({ name: "", email: "", password: "", role: "Cliente" });
    }
  };

  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setError("");
    setForm({ name: "", email: "", password: "", role: "Cliente" });
  };

  const inputClass = "w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Bienvenido</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Accede a tu cuenta de DomusRD</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-black dark:hover:text-white transition">×</button>
        </div>

        {/* TABS */}
        <div className="flex p-2 bg-gray-100 dark:bg-gray-700 m-4 rounded-2xl">
          <button
            onClick={() => switchTab(true)}
            className={`flex-1 py-3 rounded-2xl font-semibold transition ${isLogin ? "bg-white dark:bg-gray-800 shadow text-black dark:text-white" : "text-gray-500"}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => switchTab(false)}
            className={`flex-1 py-3 rounded-2xl font-semibold transition ${!isLogin ? "bg-white dark:bg-gray-800 shadow text-black dark:text-white" : "text-gray-500"}`}
          >
            Crear cuenta
          </button>
        </div>

        {/* FORM */}
        <div className="px-6 pb-6 space-y-3">

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-2xl px-4 py-3 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={inputClass}
          />

          {!isLogin && (
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputClass}
            >
              <option>Cliente</option>
              <option>Agente</option>
              <option>Vendedor</option>
            </select>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold shadow-lg transition"
          >
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="text-sm text-gray-400">o continuar con</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium">
              🌐 Google
            </button>
            <button className="border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium">
              🍎 Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}