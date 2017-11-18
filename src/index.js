/* global Module, onModuleLoaded */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {main} from "./features/reducers";
import {setFPS, setSPF, setTimestep, toggleRain} from "./features/actions";
import BoardControl from "./components/BoardControl";
import {point} from "./utils/point";

function rootReducer(state, action) {
  return main(state, action);
}

let store = createStore(rootReducer);


function mapState(state) {
  console.log(state.fps);
  return {
    rain: state.rain_toggle,
    timestep: state.timestep,
    fps: state.fps,
    spf: state.spf
  }
}
function mapDispatch(dispatch) {
  return {
    toggleRain: (toggle) => dispatch(toggleRain(toggle)),
    setTimestep: (timestep) => dispatch(setTimestep(timestep)),
    setFPS: (fps) => dispatch(setFPS(fps)),
    setSPF: (SPF) => dispatch(setSPF(SPF))
  }
}

let ReduxApp = connect(mapState, mapDispatch)(BoardControl);


ReactDOM.render(
  <Provider store={store}>
    <ReduxApp
      size={point(301, 301)}
      width={600}
      height={600}
      acceleration={1.0}
      damping={0.002}
      rain={true}
      Module={Module}
      onModuleLoaded={onModuleLoaded}/>
  </Provider>, document.getElementById('root')
);