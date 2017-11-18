import {SET_TIMESTEP, TOGGLE_RAIN, SET_FPS, SET_SPF} from './actions';

const initial = {
  rain_toggle: false,
  timestep: 0.25,
  fps: 40,
  spf: 4,
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
    default:
      return state;
  }
}

export {main};