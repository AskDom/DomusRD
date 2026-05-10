import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Publish from "./pages/Publish";
import PropertyDetail from "./pages/PropertyDetail";

function App() {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/publish" element={<Publish />} />

        <Route
          path="/property/:id"
          element={<PropertyDetail />}
        />

      </Routes>

    </Router>
  );
}

export default App;