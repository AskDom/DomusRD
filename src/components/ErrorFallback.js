// Fallback del Sentry.ErrorBoundary que envuelve toda la app en index.js —
// se muestra en vez de una pantalla blanca cuando cualquier componente
// tira un error de render. A propósito no depende de framer-motion ni de
// nada que pueda fallar a su vez: es la última línea de defensa.
export default function ErrorFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-gray-950">
      <p className="text-6xl mb-4">😕</p>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Algo salió mal</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Encontramos un error inesperado. Ya quedó reportado — probá recargar la página.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition"
        style={{ background: "linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)" }}
      >
        Recargar página
      </button>
    </div>
  );
}
