import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputGroup from "../InputGroup";

class MouseParams extends Component {
  render() {
    return (
      <InputGroup name="Input: ">
        Mouse trace:
        <input
          type="checkbox"
          checked={this.props.trace}
          onChange={(e) => this.props.toggleTrace(e.target.checked)}/> <br/>
        Click radius:
        <input
          type="number" step="1" min="1" max="20"
          value={this.props.pressRadius}
          onChange={(e) => this.props.setPressRadius(parseFloat(e.target.value))}/> <br/>
        Mouse trace radius:
        <input
          type="number" step="1" min="1" max="20"
          value={this.props.moveRadius}
          onChange={(e) => this.props.setMoveRadius(parseFloat(e.target.value))}/> <br/>
        Click strength:
        <input
          type="number" step="0.5" min="1" max="50"
          value={this.props.pressForce}
          onChange={(e) => this.props.setPressForce(parseFloat(e.target.value))}/> <br/>
        Mouse trace strength:
        <input
          type="number" step="0.05" min="0.1" max="5"
          value={this.props.moveForce}
          onChange={(e) => this.props.setMoveForce(parseFloat(e.target.value))}/> <br/>
      </InputGroup>
    );
  }
}

MouseParams.propTypes = {};
MouseParams.defaultProps = {};

export default MouseParams;
