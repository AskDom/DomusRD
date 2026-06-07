import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useInbox } from "../context/InboxContext";

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function Inbox() {
  const { currentUser } = useAuth();
  const { getInbox, getSent, markAsRead, deleteMessage, getUnreadCount } = useInbox();
  const [tab, setTab] = useState("recibidos");
  const [selected, setSelected] = useState(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Inicia sesión para ver tu inbox</h2>
          <Link to="/" className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  const inbox = getInbox(currentUser.id);
  const sent = getSent(currentUser.id);
  const unread = getUnreadCount(currentUser.id);
  const messages = tab === "recibidos" ? inbox : sent;

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.read && msg.toId === currentUser.id) markAsRead(msg.id);
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            Inbox
            {unread > 0 && (
              <span className="bg-red-500 text-white text-sm px-2.5 py-1 rounded-full font-bold">{unread}</span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Mensajes sobre tus propiedades</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LISTA DE MENSAJES */}
          <div className="lg:col-span-1">

            {/* TABS */}
            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 shadow mb-3 transition-colors">
              <button
                onClick={() => { setTab("recibidos"); setSelected(null); }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 ${tab === "recibidos" ? "bg-blue-600 text-white shadow" : "text-gray-500 dark:text-gray-400"}`}
              >
                📥 Recibidos
                {unread > 0 && <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{unread}</span>}
              </button>
              <button
                onClick={() => { setTab("enviados"); setSelected(null); }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "enviados" ? "bg-blue-600 text-white shadow" : "text-gray-500 dark:text-gray-400"}`}
              >
                📤 Enviados
              </button>
            </div>

            {/* LISTA */}
            <div className="space-y-2">
              {messages.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow transition-colors">
                  <p className="text-3xl mb-2">{tab === "recibidos" ? "📭" : "📤"}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {tab === "recibidos" ? "No tienes mensajes recibidos" : "No has enviado mensajes"}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleSelect(msg)}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow cursor-pointer hover:shadow-md transition-all border-2 ${
                      selected?.id === msg.id
                        ? "border-blue-500"
                        : "border-transparent dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                          {(tab === "recibidos" ? msg.fromName : msg.toName).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {tab === "recibidos" ? msg.fromName : msg.toName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{msg.propertyTitle}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p className="text-xs text-gray-400">{timeAgo(msg.createdAt)}</p>
                        {!msg.read && tab === "recibidos" && (
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{msg.text}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* DETALLE DEL MENSAJE */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 transition-colors"
                >
                  {/* HEADER MENSAJE */}
                  <div className="flex items-start justify-between mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                        {(tab === "recibidos" ? selected.fromName : selected.toName).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {tab === "recibidos" ? selected.fromName : selected.toName}
                        </p>
                        <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString("es-DO")}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { deleteMessage(selected.id); setSelected(null); }}
                      className="text-red-400 hover:text-red-600 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-xl transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                  {/* PROPIEDAD */}
                  {selected.propertyId && (
                    <Link to={`/property/${selected.propertyId}`}>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
                        <span className="text-2xl">🏠</span>
                        <div>
                          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Propiedad relacionada</p>
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{selected.propertyTitle}</p>
                        </div>
                        <span className="ml-auto text-blue-400 text-sm">→</span>
                      </div>
                    </Link>
                  )}

                  {/* TEXTO */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 transition-colors">
                    <p className="text-gray-700 dark:text-gray-200 leading-7 whitespace-pre-wrap">{selected.text}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-12 text-center h-full flex flex-col items-center justify-center transition-colors"
                >
                  <p className="text-5xl mb-4">✉️</p>
                  <p className="text-gray-500 dark:text-gray-400 font-semibold">Selecciona un mensaje para leerlo</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}