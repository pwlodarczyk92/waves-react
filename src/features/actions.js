export const TOGGLE_RAIN = "TOGGLE_RAIN";
export const SET_TIMESTEP = "SET_TIMESTEP";
export const SET_FPS = "SET_FPS";
export const SET_SPF = "SET_SPF";

export function toggleRain(toggle) {
  return {
    type: TOGGLE_RAIN,
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
