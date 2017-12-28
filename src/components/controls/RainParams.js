import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputGroup from "../InputGroup";

class RainParams extends Component {
  render() {
    return (
      <InputGroup name="Rain Options: ">
        Rain:
        <input
          type="checkbox"
          checked={this.props.rain}
          onChange={(e) => this.props.toggleRain(e.target.checked)}/> <br/>
        Drops per second:
        <input
          type="number" step="1" min="0" max="100"
          value={this.props.dps}
          onChange={(e) => this.props.setDPS(parseFloat(e.target.value))}/> <br/>
        Raindrop radius:
        <input
          type="number" step="1" min="1" max="20"
          value={this.props.rainRadius}
          onChange={(e) => this.props.setRainRadius(parseFloat(e.target.value))}/> <br/>
        Raindrop strength:
        <input
          type="number" step="0.5" min="1" max="50"
          value={this.props.rainForce}
          onChange={(e) => this.props.setRainForce(parseFloat(e.target.value))}/> <br/>
      </InputGroup>
    );
  }
}

RainParams.propTypes = {};
RainParams.defaultProps = {};

export default RainParams;
