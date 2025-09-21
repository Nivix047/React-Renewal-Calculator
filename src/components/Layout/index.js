import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import RateCalculator from "../pages/RateCalculator";
import RateIncrease from "../pages/RateIncrease";
import EmailSubject from "../pages/EmailSubject";

export default function Layout() {
  return (
    <Router basename="/React-Renewal-Calculator">
      <Navbar />
      <Routes>
        <Route path="/" element={<RateCalculator />} />
        <Route path="/rate-increase" element={<RateIncrease />} />
        <Route path="/email-subject" element={<EmailSubject />} />
      </Routes>
    </Router>
  );
}
