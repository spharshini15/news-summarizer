import React from "react";
import { Routes, Route } from "react-router-dom";
import NewsList from "./components/NewsList";
import SummaryPage from "./components/SummaryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsList />} />
      <Route path="/summary" element={<SummaryPage />} />
    </Routes>
  );
}

export default App;