/* global Module, onModuleLoaded */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


ReactDOM.render(<App
  xsize={200}
  ysize={200}
  height={600}
  width={600}
  acceleration={0.01}
  damping={0.002}
  fps={30}
  Module={Module}
  onModuleLoaded={onModuleLoaded}/>, document.getElementById('root'));