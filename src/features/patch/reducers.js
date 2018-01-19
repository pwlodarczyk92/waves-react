import {SET_FORCE, SET_RADIUS} from "./actions";
import {geq, number, obj, postcheck} from "../../utils/checks";

function main(state, action) {
  switch (action.type) {
    case SET_FORCE:
      return {...state, force: action.force};
    case SET_RADIUS:
      return {...state, radius: action.radius};
    default:
      return state;
  }
}

export const bigPatch = {
  radius: 15,
  force: 5,
};
export const smallPatch = {
  radius: 5,
  force: 0.5,
};

export const patchT = obj({
  radius: geq(1),
  force: number,
});
main = postcheck(patchT, main);

export {main}