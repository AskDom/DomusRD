import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import Publish from "./pages/Publish";
import PropertyDetail from "./pages/PropertyDetail";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;