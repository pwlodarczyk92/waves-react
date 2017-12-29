import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PatchControl extends Component {
  render() {
    const props = this.props;
    const radiusInput = this.props.input.radius;
    const forceInput = this.props.input.force;
    return (
      <div>
        {`${props.name} radius:`}
        <input
          type="number" step={radiusInput.step} min={radiusInput.min} max={radiusInput.max}
          value={props.patch.radius}
          onChange={(e) => props.setter(props.actions.radius(parseFloat(e.target.value)))}/> <br/>
        {`${props.name} strength:`}
        <input
          type="number" step={forceInput.step} min={forceInput.min} max={forceInput.max}
          value={props.patch.force}
          onChange={(e) => props.setter(props.actions.force(parseFloat(e.target.value)))}/> <br/>
      </div>
    );
  }
}

export const bigPatchInput = {
  force: {
    step: 0.5,
    min: 0,
    max: 50
  },
  radius: {
    step: 1,
    min: 5,
    max: 25
  }
};
export const smallPatchInput = {
  force: {
    step: 0.05,
    min: 0,
    max: 5
  },
  radius: {
    step: 1,
    min: 5,
    max: 15
  }
};

PatchControl.propTypes = {
  patch: PropTypes.shape({
    radius: PropTypes.number.isRequired,
    force: PropTypes.number.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    force: PropTypes.func.isRequired,
    radius: PropTypes.func.isRequired
  }).isRequired,
  input: PropTypes.shape({
    force: PropTypes.shape({
      step: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    radius: PropTypes.shape({
      step: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
  }).isRequired,
  setter: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

PatchControl.defaultProps = {
  input: bigPatchInput
};

export default PatchControl;
