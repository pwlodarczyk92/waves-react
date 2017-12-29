export const TOGGLE_RAIN = "TOGGLE_RAIN";
export const TOGGLE_PAUSED = "TOGGLE_PAUSED";
export const TOGGLE_TRACE = "TOGGLE_TRACE";
export const SET_TIMESTEP = "SET_TIMESTEP";
export const SET_FPS = "SET_FPS";
export const SET_SPF = "SET_SPF";
export const SET_DPS = "SET_DPS";
export const SET_ACCELERATION = "SET_ACCELERATION";
export const SET_DAMPING = "SET_DAMPING";
export const SET_RAIN = "SET_RAIN";
export const SET_TRACE = "SET_TRACE";
export const SET_PRESS = "SET_PRESS";
export const SET_COLOR = "SET_COLOR";
export const LOW_COLOR = "LOW_COLOR";
export const HIGH_COLOR = "HIGH_COLOR";
export const ZERO_COLOR = "ZERO_COLOR";


export function toggleRain(toggle) {
  return {
    type: TOGGLE_RAIN,
    toggle
  }
}
export function togglePaused(toggle) {
  return {
    type: TOGGLE_PAUSED,
    toggle
  }
}
export function toggleTrace(toggle) {
  return {
    type: TOGGLE_TRACE,
    toggle
  }
}
export function setTimestep(timestep) {
  return {
    type: SET_TIMESTEP,
    timestep
  }
}
export function setFPS(fps) {
  return {
    type: SET_FPS,
    fps
  }
}
export function setSPF(spf) {
  return {
    type: SET_SPF,
    spf
  }
}
export function setDPS(dps) {
  return {
    type: SET_DPS,
    dps
  }
}
export function setAcceleration(acceleration) {
  return {
    type: SET_ACCELERATION,
    acceleration
  }
}
export function setDamping(damping) {
  return {
    type: SET_DAMPING,
    damping
  }
}
export function setRain(action) {
  return {
    type: SET_RAIN,
    action
  }
}
export function setPress(action) {
  return {
    type: SET_PRESS,
    action
  }
}
export function setTrace(action) {
  return {
    type: SET_TRACE,
    action
  }
}
export function setColor(color, value) {
  return {
    type: SET_COLOR,
    color,
    value
  }
}
