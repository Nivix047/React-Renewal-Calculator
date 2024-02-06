import React from "react";
import Navbar from "../Navbar";
import Home from "../pages/Home";
import Mercury from "../pages/Mercury";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function Layout() {
  return (
    <Router basename="React-Renewal-Calculator">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mercury" element={<Mercury />} />
      </Routes>
    </Router>
  );
}
