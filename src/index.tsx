import React from 'react';
import ReactDOM from 'react-dom';

import './sass/styles.scss';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('main'),
);
