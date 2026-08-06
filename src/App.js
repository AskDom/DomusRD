import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { trackPageView } from "./analytics";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PropertiesProvider } from "./context/PropertiesContext";
import { InboxProvider } from "./context/InboxContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { ToastProvider } from "./context/ToastContext";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import PageLoader from "./components/PageLoader";

// Cada página es su propio chunk — antes todo esto (incluido el panel de
// Admin y el mapa de Leaflet, que casi nadie visita) iba en el bundle
// inicial. PageLoader se ve mientras React baja el chunk de la ruta pedida.
const Home            = lazy(() => import("./pages/Home"));
const Publish         = lazy(() => import("./pages/Publish"));
const PropertyDetail  = lazy(() => import("./pages/PropertyDetail"));
const SearchResults   = lazy(() => import("./pages/SearchResults"));
const Profile         = lazy(() => import("./pages/Profile"));
const AgentProfile    = lazy(() => import("./pages/AgentProfile"));
const Favorites       = lazy(() => import("./pages/Favorites"));
const Inbox           = lazy(() => import("./pages/Inbox"));
const NotFound        = lazy(() => import("./pages/NotFound"));
const Admin           = lazy(() => import("./pages/Admin"));
const ForgotPassword  = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword   = lazy(() => import("./pages/ResetPassword"));
const Terminos        = lazy(() => import("./pages/Terminos"));
const Privacidad      = lazy(() => import("./pages/Privacidad"));
const Cookies         = lazy(() => import("./pages/Cookies"));

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Solo el pathname, nunca location.search: la query string puede llevar
    // datos sensibles (p. ej. el token de /reset-password?token=...) y no
    // queremos que viajen a Google Analytics.
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/search" element={<PageTransition><SearchResults /></PageTransition>} />
          <Route path="/property/:id" element={<PageTransition><PropertyDetail /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/agent/:id" element={<PageTransition><AgentProfile /></PageTransition>} />
          <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
          <Route path="/inbox" element={<PageTransition><Inbox /></PageTransition>} />
          <Route path="/publish" element={
            <PageTransition>
              <ProtectedRoute>
                <Publish />
              </ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/terminos" element={<PageTransition><Terminos /></PageTransition>} />
          <Route path="/privacidad" element={<PageTransition><Privacidad /></PageTransition>} />
          <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PropertiesProvider>
          <InboxProvider>
            <NotificationsProvider>
              <ToastProvider>
                <Router>
                  <AnimatedRoutes />
                </Router>
              </ToastProvider>
            </NotificationsProvider>
          </InboxProvider>
        </PropertiesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;