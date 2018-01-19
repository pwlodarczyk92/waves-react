/* global Module, onModuleLoaded */

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import {point} from "./utils/point";

import './index.css';
import {main} from "./features/reducers";
import {setForce, setRadius} from "./features/patch/actions";
import {
  addSource, removeSource,
  setAcceleration, setColor, setDamping, setDPS, setFPS, setPress, setRain, setSPF, setState,
  setTimestep, setTrace, toggleNormalize,
  togglePaused,
  toggleRain,
  toggleTrace
} from "./features/actions";

import BoardControl from "./components/BoardControl";
import URLBoard from "./components/URLBoard";
import Pusher from "./components/Pusher";

function rootReducer(state, action) {
  return main(state, action);
}

let store = createStore(rootReducer);


function mapState(state) {
  return {
    normalize: state.normalize,
    rainToggle: state.rainToggle,
    traceToggle: state.traceToggle,
    paused: state.paused,
    timestep: state.timestep,
    fps: state.fps,
    spf: state.spf,
    dps: state.dps,
    acceleration: state.acceleration,
    damping: state.damping,
    rain: state.rain,
    trace: state.trace,
    press: state.press,
    sources: state.sources,
    colors: {
      lowColor: state.lowColor,
      highColor: state.highColor,
      zeroColor: state.zeroColor
    }
  }
}


function mapDispatch(dispatch) {
  return {
    toggleNormalize: (toggle) => dispatch(toggleNormalize(toggle)),
    toggleRain: (toggle) => dispatch(toggleRain(toggle)),
    togglePaused: (toggle) => dispatch(togglePaused(toggle)),
    toggleTrace: (toggle) => dispatch(toggleTrace(toggle)),
    setTimestep: (timestep) => dispatch(setTimestep(timestep)),
    setFPS: (fps) => dispatch(setFPS(fps)),
    setSPF: (spf) => dispatch(setSPF(spf)),
    setDPS: (dps) => dispatch(setDPS(dps)),
    setAcceleration: (acceleration) => dispatch(setAcceleration(acceleration)),
    setDamping: (acceleration) => dispatch(setDamping(acceleration)),
    patchActions: {
      radius: (radius) => setRadius(radius),
      force: (force) => setForce(force)
    },
    setRain: (action) => dispatch(setRain(action)),
    setTrace: (action) => dispatch(setTrace(action)),
    setPress: (action) => dispatch(setPress(action)),
    setColor: (color, value) => dispatch(setColor(color, value)),
    addSource: (key, position, amplitude, period, shift) => dispatch(addSource(key, position, amplitude, period, shift)),
    removeSource: (key) => dispatch(removeSource(key))
  }
}


let ReduxApp = connect(mapState, mapDispatch)(URLBoard);
let ConnectedPusher = connect((state) => ({state}), (dispatch) => ({setState: (state) => dispatch(setState(state))}))(Pusher);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route path="/" component={ConnectedPusher}/>
        <Route path="/" component={ReduxApp}/>
      </div>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
);