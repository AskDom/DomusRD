import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(true);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">🔒</p>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Inicia sesión para continuar</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Necesitas una cuenta para publicar propiedades</p>
        <button
          onClick={() => setAuthOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
        >
          Iniciar sesión / Registrarse
        </button>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return children;
}