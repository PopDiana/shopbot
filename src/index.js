import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';


let products = [{}]

ReactDOM.render(
  <App products={products} />,
  document.getElementById('root')
);
