import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Board from "./Board";

class BoardControl extends Component {
  render() {
    return (
      <div>
        <Board {...this.props}/>
        Rain: <input
          type="checkbox"
          checked={this.props.rain}
          onChange={(e) => this.props.toggleRain(e.target.checked)}/> <br/>
        Timestep: <input
          type="number"
          step="0.01"
          min="-1"
          max="1"
          defaultValue="0.25"
          onChange={(e) => this.props.setTimestep(parseFloat(e.target.value))}/> <br/>
        FPS: <input
          type="number"
          step="1"
          min="10"
          max="120"
          defaultValue="40"
          onChange={(e) => this.props.setFPS(parseInt(e.target.value))}/> <br/>
        Steps per frame: <input
          type="number"
          step="1"
          min="1"
          max="10"
          defaultValue="4"
          onChange={(e) => this.props.setSPF(parseInt(e.target.value))}/>
      </div>
    );
  }
}

BoardControl.propTypes = {};
BoardControl.defaultProps = {};

export default BoardControl;
