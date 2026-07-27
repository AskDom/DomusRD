import * as Sentry from "@sentry/react";

const dsn = process.env.REACT_APP_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });

  // El código ya loguea sus errores de forma consistente con
  // console.error("mensaje", err) en cada catch. En vez de tocar cada
  // context/página uno por uno, reenviamos automáticamente a Sentry
  // cualquier console.error que reciba un objeto Error entre sus argumentos.
  const originalConsoleError = console.error;
  // eslint-disable-next-line no-console
  console.error = (...args) => {
    originalConsoleError(...args);
    const error = args.find((arg) => arg instanceof Error);
    if (error) Sentry.captureException(error);
  };
}

export default Sentry;
