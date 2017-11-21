import {
  SET_TIMESTEP, TOGGLE_RAIN, SET_FPS, SET_SPF, SET_ACCELERATION, SET_DAMPING, TOGGLE_PAUSED,
  TOGGLE_TRACE, SET_DPS, SET_RAIN_RADIUS, SET_MOVE_RADIUS, SET_PRESS_RADIUS, SET_RAIN_FORCE, SET_PRESS_FORCE,
  SET_MOVE_FORCE, SET_COLOR, LOW_COLOR, HIGH_COLOR, ZERO_COLOR
} from './actions';

const initial = {
  rain: false,
  paused: false,
  trace: true,
  timestep: 0.25,
  acceleration: 1.0,
  damping:0.001,
  fps: 40,
  spf: 4,
  dps: 1,
  rainRadius: 10,
  moveRadius: 5,
  pressRadius: 10,
  rainForce: 5,
  moveForce: 0.5,
  pressForce: 15,
  lowColor: {r: 255, g: 0, b: 0},
  highColor: {r: 0, g: 0, b: 255},
  zeroColor: {r: 0, g: 0, b: 0}
};

function main(state = initial, action) {
  switch (action.type) {
    case TOGGLE_RAIN:
      return {...state, rain: action.toggle};
    case TOGGLE_PAUSED:
      return {...state, paused: action.toggle};
    case TOGGLE_TRACE:
      return {...state, trace: action.toggle};
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
    case SET_RAIN_RADIUS:
      return {...state, rainRadius: action.radius};
    case SET_MOVE_RADIUS:
      return {...state, moveRadius: action.radius};
    case SET_PRESS_RADIUS:
      return {...state, pressRadius: action.radius};
    case SET_RAIN_FORCE:
      return {...state, rainForce: action.force};
    case SET_PRESS_FORCE:
      return {...state, pressForce: action.force};
    case SET_MOVE_FORCE:
      return {...state, moveForce: action.force};
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

export {main};