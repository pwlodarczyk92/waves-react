import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Board from "./Board";

class BoardControl extends Component {
  render() {
    console.log(this.props.acceleration);
    return (
      <div>
        <Board {...this.props}/>
        Rain:
        <input
          type="checkbox"
          checked={this.props.rain}
          onChange={(e) => this.props.toggleRain(e.target.checked)}/> <br/>
        Timestep:
        <input
          type="number" step="0.01" min="-1" max="1"
          value={this.props.timestep}
          onChange={(e) => this.props.setTimestep(parseFloat(e.target.value))}/> <br/>
        FPS:
        <input
          type="number" step="1" min="10" max="120"
          value={this.props.fps}
          onChange={(e) => this.props.setFPS(parseInt(e.target.value))}/> <br/>
        Steps per frame:
        <input
          type="number" step="1" min="1" max="10"
          value={this.props.spf}
          onChange={(e) => this.props.setSPF(parseInt(e.target.value))}/> <br/>
        Acceleration:
        <input
          type="number" step="0.01" min="0" max="2"
          value={this.props.acceleration}
          onChange={(e) => this.props.setAcceleration(parseFloat(e.target.value))}/> <br/>
        Damping:
        <input
          type="number" step="0.0005" min="0" max="0.1"
          value={this.props.damping}
          onChange={(e) => this.props.setDamping(parseFloat(e.target.value))}/> <br/>
      </div>
    );
  }
}

BoardControl.propTypes = {};
BoardControl.defaultProps = {};

export default BoardControl;
