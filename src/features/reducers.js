import {
  SET_TIMESTEP, TOGGLE_RAIN, SET_FPS, SET_SPF, SET_ACCELERATION, SET_DAMPING, TOGGLE_PAUSED,
  TOGGLE_TRACE, SET_DPS, SET_COLOR, LOW_COLOR, HIGH_COLOR, ZERO_COLOR, SET_RAIN, SET_TRACE, SET_PRESS, ADD_SOURCE,
  REMOVE_SOURCE, SET_STATE, TOGGLE_NORMALIZE
} from './actions';
import * as patch from "./patch/reducers";
import {smallPatch} from "./patch/reducers";
import {bigPatch} from "./patch/reducers";
import {all, any, bool, geq, integer, number, obj, positive, postcheck, values} from "../utils/checks";
import {patchT} from "./patch/reducers";
import {rgbT} from "../utils/color";

export const initialState = {
  timestep: 0.25,
  acceleration: 1.0,
  damping:0.001,
  normalize: true,

  paused: false,
  fps: 60,
  spf: 4,

  rainToggle: false,
  dps: 10,
  rain: bigPatch,

  traceToggle: true,
  trace: smallPatch,

  press: bigPatch,

  lowColor: {r: 255, g: 0, b: 0},
  highColor: {r: 0, g: 0, b: 255},
  zeroColor: {r: 0, g: 0, b: 0},

  sources: {}
};

function main(state = initialState, action) {
  switch (action.type) {
    case SET_STATE:
      return action.state;
    case REMOVE_SOURCE: {
      const newSources = {...state.sources};
      delete newSources[action.key];
      return {...state, sources: newSources};
    }
    case ADD_SOURCE: {
      const newSources = {...state.sources};
      newSources[action.source.key] = action.source;
      return {...state, sources: newSources};
    }
    case TOGGLE_RAIN:
      return {...state, rainToggle: action.toggle};
    case TOGGLE_TRACE:
      return {...state, traceToggle: action.toggle};
    case TOGGLE_PAUSED:
      return {...state, paused: action.toggle};
    case TOGGLE_NORMALIZE:
      return {...state, normalize: action.toggle};
    case SET_TIMESTEP:
      return {...state, timestep: action.timestep};
    case SET_FPS:
      return {...state, fps: action.fps};
    case SET_SPF:
      return {...state, spf: action.spf};
    case SET_DPS:
      return {...state, dps: action.dps};
    case SET_ACCELERATION:
      return {...state, acceleration: action.acceleration};
    case SET_DAMPING:
      return {...state, damping: action.damping};
    case SET_RAIN:
      return {...state, rain: patch.main(state.rain, action.action)};
    case SET_TRACE:
      return {...state, trace: patch.main(state.trace, action.action)};
    case SET_PRESS:
      return {...state, press: patch.main(state.press, action.action)};
    case SET_COLOR:
      switch (action.value) {
        case LOW_COLOR:
          return {...state, lowColor: action.color};
        case HIGH_COLOR:
          return {...state, highColor: action.color};
        case ZERO_COLOR:
          return {...state, zeroColor: action.color};
        default:
          throw new Error("illegal state value");
      }
    default:
      return state;
  }
}

export const stateT = obj({
  timestep: number,
  acceleration: number,
  damping: number,
  normalize: bool,

  paused: bool,
  fps: geq(1),
  spf: all(integer, positive),

  rainToggle: bool,
  dps: positive,
  rain: patchT,

  traceToggle: bool,
  trace: patchT,

  press: patchT,

  lowColor: rgbT,
  highColor: rgbT,
  zeroColor: rgbT,

  sources: values(obj({
    amplitude: number,
    period: positive,
    shift: number,
    position: obj({
      x: all(integer, geq(0)),
      y: all(integer, geq(0)),
    }),
  }))
});

main = postcheck(stateT, main);

export {main};