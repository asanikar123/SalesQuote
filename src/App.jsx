import { Route, Routes, Navigate } from "react-router-dom";
import QuoteBuilderPage from "./pages/QuoteBuilderPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuoteBuilderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
