
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("MedRefConnect: Initializing application...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Could not find root element with id 'root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("MedRefConnect: App mounted successfully.");
  } catch (error) {
    console.error("MedRefConnect: Failed to mount app:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; margin: 20px; font-family: sans-serif;">
        <h2 style="margin-top: 0;">Application Error</h2>
        <p>The application failed to start. Please check the console for details.</p>
      </div>
    `;
  }
}
