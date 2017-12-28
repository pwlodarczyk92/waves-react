/* global Module, onModuleLoaded */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {main} from "./features/reducers";
import {
  setAcceleration, setColor, setDamping, setDPS, setFPS, setMoveForce, setMoveRadius, setPressForce, setPressRadius,
  setRainForce,
  setRainRadius, setSPF,
  setTimestep,
  togglePaused,
  toggleRain,
  toggleTrace
} from "./features/actions";
import BoardControl from "./components/BoardControl";
import {point} from "./utils/point";

function rootReducer(state, action) {
  return main(state, action);
}

let store = createStore(rootReducer);


function mapState(state) {
  return {
    rain: state.rain,
    paused: state.paused,
    trace: state.trace,
    timestep: state.timestep,
    fps: state.fps,
    spf: state.spf,
    dps: state.dps,
    acceleration: state.acceleration,
    damping: state.damping,
    rainRadius: state.rainRadius,
    moveRadius: state.moveRadius,
    pressRadius: state.pressRadius,
    rainForce: state.rainForce,
    pressForce: state.pressForce,
    moveForce: state.moveForce,
    colors: {
      lowColor: state.lowColor,
      highColor: state.highColor,
      zeroColor: state.zeroColor
    }
  }
}
function mapDispatch(dispatch) {
  return {
    toggleRain: (toggle) => dispatch(toggleRain(toggle)),
    togglePaused: (toggle) => dispatch(togglePaused(toggle)),
    toggleTrace: (toggle) => dispatch(toggleTrace(toggle)),
    setTimestep: (timestep) => dispatch(setTimestep(timestep)),
    setFPS: (fps) => dispatch(setFPS(fps)),
    setSPF: (spf) => dispatch(setSPF(spf)),
    setDPS: (dps) => dispatch(setDPS(dps)),
    setAcceleration: (acceleration) => dispatch(setAcceleration(acceleration)),
    setDamping: (acceleration) => dispatch(setDamping(acceleration)),
    setPressRadius: (radius) => dispatch(setPressRadius(radius)),
    setMoveRadius: (radius) => dispatch(setMoveRadius(radius)),
    setRainRadius: (radius) => dispatch(setRainRadius(radius)),
    setPressForce: (radius) => dispatch(setPressForce(radius)),
    setMoveForce: (radius) => dispatch(setMoveForce(radius)),
    setRainForce: (radius) => dispatch(setRainForce(radius)),
    setColor: (color, value) => dispatch(setColor(color, value))
  }
}

let ReduxApp = connect(mapState, mapDispatch)(BoardControl);


ReactDOM.render(
  <Provider store={store}>
    <ReduxApp
      size={point(401, 301)}
      width={800}
      height={600}
      Module={Module}
      onModuleLoaded={onModuleLoaded}/>
  </Provider>, document.getElementById('root')
);