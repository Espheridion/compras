
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro del Service Worker para capacidades Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registrado correctamente:', registration.scope);
      })
      .catch(error => {
        console.log('Fallo al registrar SW:', error);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
