import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const { refreshUser } = useAuth();

  // "loading" | "success" | "error"
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState("");

  // El token de verificación es de un solo uso — evita mandar el POST dos
  // veces (p.ej. por el doble-invoke de efectos que hace React.StrictMode
  // en desarrollo), lo cual haría fallar la segunda llamada y mostraría
  // "enlace inválido" aunque la verificación ya se hizo con éxito.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token || requestedRef.current) return;
    requestedRef.current = true;

    fetch(`${API_URL}/api/auth/verify-email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "El enlace es inválido o ya expiró.");
          return;
        }
        setStatus("success");
        // Refresca la sesión para que emailVerified se refleje sin re-loguearse.
        refreshUser();
      })
      .catch(() => {
        setStatus("error");
        setMessage("No se pudo conectar con el servidor. Intenta de nuevo.");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center"
        >
          {status === "loading" && (
            <>
              <svg className="animate-spin w-8 h-8 mx-auto text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <h1 className="text-xl font-black text-gray-900 dark:text-white mt-4">Verificando tu correo...</h1>
            </>
          )}

          {status === "success" && (
            <>
              <p className="text-4xl mb-3">✅</p>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">¡Correo verificado!</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Ya puedes publicar propiedades en DomusRD.
              </p>
              <Link to="/" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
                Ir al inicio →
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-4xl mb-3">⚠️</p>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">Enlace inválido</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {message || "Este enlace de verificación no es válido."}
              </p>
              <Link to="/" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
                Ir al inicio — puedes pedir un nuevo enlace desde el aviso arriba →
              </Link>
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
