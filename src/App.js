import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PropertiesProvider } from "./context/PropertiesContext";

import Home from "./pages/Home";
import Publish from "./pages/Publish";
import PropertyDetail from "./pages/PropertyDetail";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PropertiesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
            </Routes>
          </Router>
        </PropertiesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;