import React from 'react';
// import ReactDOM from 'react-dom/client';
import { hydrate, render } from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement?.hasChildNodes()) {
  hydrate(app, rootElement);
} else {
  render(app, rootElement);
}

serviceWorkerRegistration.register();
reportWebVitals();
