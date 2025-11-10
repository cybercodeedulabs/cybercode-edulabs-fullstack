// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext";
import { IAMProvider } from "./contexts/IAMContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <IAMProvider>
        <App />
      </IAMProvider>
    </UserProvider>
  </StrictMode>
);
