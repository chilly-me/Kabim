import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from "./Home.jsx";
import Ship from "./ShipModel.jsx";
import Courtyard from "./Courtyard.jsx";
import Cottage from "./Cottage.jsx";
import Box from "./Extruded_boxModel.jsx";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ship" element={<Ship />} />
          <Route path="/courtyard" element={<Courtyard />} />
          <Route path="/cottage" element={<Cottage />} />
          <Route path="/box" element={<Box />} />
        </Routes>
    </Router>
  );
};

export default App;
