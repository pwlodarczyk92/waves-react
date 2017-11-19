import {SET_TIMESTEP, TOGGLE_RAIN, SET_FPS, SET_SPF, SET_ACCELERATION, SET_DAMPING} from './actions';

const initial = {
  rain_toggle: false,
  timestep: 0.25,
  fps: 40,
  spf: 4,
  acceleration: 1.0,
  damping:0.01
};

function main(state = initial, action) {
  switch (action.type) {
    case TOGGLE_RAIN:
      return {...state, rain_toggle: action.toggle};
    case SET_TIMESTEP:
      return {...state, timestep: action.timestep};
    case SET_FPS:
      return {...state, fps: action.fps};
    case SET_SPF:
      return {...state, spf: action.spf};
    case SET_ACCELERATION:
      return {...state, acceleration: action.acceleration};
    case SET_DAMPING:
      return {...state, damping: action.damping};
    default:
      return state;
  }
}

export {main};