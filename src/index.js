import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Park from './Park';
// import App from './App';

ReactDOM.render(<Park />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));

// IMPORTANT: Line 66 in webpack.config.prod.js controls minification "devtool: "
  // Manually set as '#inline-source-map' now

