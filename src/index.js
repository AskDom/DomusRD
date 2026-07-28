import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Sentry from './sentry';
import reportWebVitals from './reportWebVitals';

function ErrorFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, fontFamily: "sans-serif", padding: 24, textAlign: "center" }}>
      <p style={{ fontSize: 40 }}>😕</p>
      <h1 style={{ fontWeight: 900, fontSize: 20 }}>Algo salió mal</h1>
      <p style={{ color: "#6b7280", fontSize: 14 }}>Ya nos enteramos del error. Intenta recargar la página.</p>
      <button
        onClick={() => window.location.reload()}
        style={{ background: "#1a56db", color: "white", padding: "10px 20px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}
      >
        Recargar
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
