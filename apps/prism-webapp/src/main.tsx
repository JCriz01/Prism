import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactDOM } from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router";
import App from "./App.tsx";

// This is the entry point of the application. The App component is rendered
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
