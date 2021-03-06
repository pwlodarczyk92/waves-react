import React, {Component} from 'react';
import InputGroup from "../helpers/InputGroup";

class BoardParams extends Component {
  render() {
    return (
      <InputGroup name="Physics">
        Normalize:
        <input
          type="checkbox"
          checked={this.props.normalize}
          onChange={(e) => this.props.toggleNormalize(e.target.checked)}/> <br/>
        Time step:
        <input
          type="number" step="0.01" min="-1" max="1"
          value={this.props.timestep}
          onChange={(e) => this.props.setTimestep(parseFloat(e.target.value))}/> <br/>
        Damping:
        <input
          type="number" step="0.0005" min="0" max="0.1"
          value={this.props.damping}
          onChange={(e) => this.props.setDamping(parseFloat(e.target.value))}/> <br/>
        Acceleration:
        <input
          type="number" step="0.01" min="0" max="2"
          value={this.props.acceleration}
          onChange={(e) => this.props.setAcceleration(parseFloat(e.target.value))}/> <br/>
      </InputGroup>
    );
  }
}

export default BoardParams;
