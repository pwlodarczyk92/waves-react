import React, {Component} from 'react';
import InputGroup from "../InputGroup";

class SimulationParams extends Component {
  render() {
    return (
      <InputGroup name="Simulation rate: ">
        Pause:
        <input
          type="checkbox"
          checked={this.props.paused}
          onChange={(e) => this.props.togglePaused(e.target.checked)}/> <br/>
        FPS:
        <input
          type="number" step="1" min="10" max="120"
          value={this.props.fps}
          onChange={(e) => this.props.setFPS(parseInt(e.target.value, 10))}/> <br/>
        Steps per frame:
        <input
          type="number" step="1" min="1" max="10"
          value={this.props.spf}
          onChange={(e) => this.props.setSPF(parseInt(e.target.value, 10))}/> <br/>
      </InputGroup>
    );
  }
}

SimulationParams.propTypes = {};
SimulationParams.defaultProps = {};

export default SimulationParams;
