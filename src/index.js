import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/bootstrap/bootstrap.min.css';
import './assets/style.css';
import App from './App';

document.title = "Pokladní systém";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

