import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './contexts/UserContext';
import React from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";   // <-- ADD THIS

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>   {/* <-- WRAP EVERYTHING */}
    <StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </StrictMode>
  </ErrorBoundary>
);
