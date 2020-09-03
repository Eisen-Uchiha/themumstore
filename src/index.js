import React from 'react';
import { hydrate, render } from 'react-dom'
import 'babel-polyfill';
import './config/polyfills';
// import ReactDOM from 'react-dom';
import './index.css';

// import Park from './Park';
import App from './App';

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
}

else {
  render(<App />, rootElement);
}
// ReactDOM.render(<Park />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));

// IMPORTANT: Line 66 in webpack.config.prod.js controls minification "devtool: "
  // Manually set as '#inline-source-map' now

