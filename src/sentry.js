// Import nombrado (no "import * as Sentry") a propósito — así el bundler
// puede tree-shakear el resto del SDK (replay, feedback, tracing) que
// nunca se usa acá. Solo queremos captura de errores, sin performance
// tracing (por eso no hay tracesSampleRate).
import { init } from "@sentry/react";

// Mismo patrón que el backend (src/config/sentry.js): sin DSN, no se
// manda nada — así que en dev, sin configurar nada, esto es un no-op.
if (process.env.REACT_APP_SENTRY_DSN) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
  });
}
