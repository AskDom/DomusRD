import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ROLES = [
  {
    value: "Cliente",
    icon: "👤",
    label: "Cliente",
    description: "Explora y guarda favoritos",
    gradient: "from-blue-500 to-blue-600",
    border: "border-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    value: "Vendedor",
    icon: "🏠",
    label: "Vendedor",
    description: "Publica hasta 3 propiedades",
    gradient: "from-green-500 to-emerald-600",
    border: "border-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    value: "Agente",
    icon: "⭐",
    label: "Agente",
    description: "Propiedades ilimitadas",
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
];

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Cliente" });
  const [showPass, setShowPass] = useState(false);
  const { login, register, error, setError, loading } = useAuth();
  const { banner } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const user = isLogin
      ? await login({ email: form.email, password: form.password })
      : await register({ name: form.name, email: form.email, password: form.password, role: form.role });
    if (user) {
      onClose();
      setForm({ name: "", email: "", password: "", role: "Cliente" });
      const firstName = user.name?.split(" ")[0] || form.name?.split(" ")[0] || "Usuario";
      banner({
        message: isLogin ? `¡Bienvenido de vuelta, ${firstName}! 👋` : `¡Cuenta creada, ${firstName}! 🎉`,
        subtitle: isLogin ? `Nos alegra tenerte de vuelta en DomusRD` : `Ya puedes explorar y guardar propiedades`,
        type: "success",
        duration: 4500,
      });
    }
  };

  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setError("");
    setForm({ name: "", email: "", password: "", role: "Cliente" });
  };

  const inputClass = "w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex"
            style={{ maxHeight: "90vh" }}
          >

            {/* ── PANEL IZQUIERDO — imagen + branding ── */}
            <div className="hidden md:flex flex-col justify-between w-[42%] relative overflow-hidden p-8"
              style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #1a56db 50%, #0ea5e9 100%)",
              }}
            >
              {/* Círculos decorativos */}
              <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
              <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>

              {/* Logo */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🏠</span>
                  <span className="text-white font-black text-2xl tracking-tight">DomusRD</span>
                </div>
                <p className="text-blue-200 text-sm">Tu plataforma inmobiliaria en República Dominicana</p>
              </div>

              {/* Stats */}
              <div className="relative z-10 space-y-4">
                {[
                  { icon: "🏘️", label: "Propiedades activas", value: "500+" },
                  { icon: "👥", label: "Agentes registrados", value: "120+" },
                  { icon: "🌴", label: "Ciudades disponibles", value: "15+" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
                      <p className="text-blue-200 text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="text-white text-sm italic leading-relaxed">
                  "Encontré el apartamento de mis sueños en menos de una semana gracias a DomusRD."
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">M</div>
                  <div>
                    <p className="text-white text-xs font-semibold">María González</p>
                    <p className="text-blue-200 text-xs">Cliente en Santo Domingo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PANEL DERECHO — formulario ── */}
            <div className="flex-1 flex flex-col overflow-y-auto">

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-0">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={isLogin ? "login" : "register"}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-2xl font-black text-gray-900 dark:text-white"
                    >
                      {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                    </motion.h2>
                  </AnimatePresence>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                    {isLogin ? "Accede a tu cuenta de DomusRD" : "Únete a la comunidad inmobiliaria"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xl ml-4 mt-1 flex-shrink-0"
                >×</button>
              </div>

              {/* Tabs */}
              <div className="px-6 mt-5">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {[{ label: "Iniciar sesión", value: true }, { label: "Crear cuenta", value: false }].map((tab) => (
                    <button
                      key={tab.label}
                      onClick={() => switchTab(tab.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isLogin === tab.value
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="px-6 py-5 space-y-3 flex-1">

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-medium"
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login-form" : "register-form"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {!isLogin && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Nombre completo</label>
                        <input
                          type="text"
                          placeholder="Juan Pérez"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Correo electrónico</label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Contraseña</label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                          className={`${inputClass} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-lg"
                        >
                          {showPass ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    {/* Selector de rol */}
                    {!isLogin && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Tipo de cuenta</label>
                        <div className="grid grid-cols-3 gap-2">
                          {ROLES.map((role) => (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => setForm({ ...form, role: role.value })}
                              className={`relative rounded-xl p-3 text-left border-2 transition-all ${
                                form.role === role.value
                                  ? `${role.border} ${role.bg}`
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              {form.role === role.value && (
                                <motion.div
                                  layoutId="role-indicator"
                                  className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}
                                >
                                  <span className="text-white text-[8px] font-bold">✓</span>
                                </motion.div>
                              )}
                              <span className="text-xl block mb-1">{role.icon}</span>
                              <p className="font-bold text-gray-900 dark:text-white text-xs">{role.label}</p>
                              <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">{role.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{
                    background: loading
                      ? "#6b7280"
                      : "linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Cargando...
                    </span>
                  ) : (
                    isLogin ? "Iniciar sesión →" : "Crear cuenta →"
                  )}
                </motion.button>

                {/* Switch */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                  <button
                    onClick={() => switchTab(!isLogin)}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition"
                  >
                    {isLogin ? "Regístrate gratis" : "Inicia sesión"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}