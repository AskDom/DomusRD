import React from "react";

// Sello de verificación estilo Instagram/Twitter: dos cuadrados redondeados
// superpuestos y rotados 45° entre sí forman el contorno de 8 puntas.
function Seal({ px }) {
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: px, height: px }}>
      <span className="absolute inset-0 rounded-[30%] bg-gradient-to-br from-blue-500 to-blue-600" />
      <span className="absolute inset-0 rounded-[30%] bg-gradient-to-br from-blue-500 to-blue-600 rotate-45" />
      <svg
        className="relative z-10"
        width={px * 0.55} height={px * 0.55}
        viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function VerifiedBadge({ size = "sm" }) {
  if (size === "lg") {
    return (
      <span
        title="Propiedad verificada por DomusRD"
        className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 pl-1 pr-3 py-1 rounded-full text-xs font-bold"
      >
        <Seal px={18} />
        Verificado
      </span>
    );
  }
  return (
    <span title="Propiedad verificada por DomusRD">
      <Seal px={18} />
    </span>
  );
}
