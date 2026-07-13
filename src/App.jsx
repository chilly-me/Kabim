import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home.jsx";
import Cottage from "./Cottage.jsx";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cottage" element={<Cottage />} />
        </Routes>
    </Router>
  );
};

export default App;
