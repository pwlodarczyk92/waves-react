export const SET_FORCE = "SET_FORCE";
export const SET_RADIUS = "SET_RADIUS";

export function setForce(force) {
  return {
    type: SET_FORCE,
    force
  }
}

export function setRadius(radius) {
  return {
    type: SET_FORCE,
    radius
  }
}