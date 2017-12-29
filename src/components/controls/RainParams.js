import React, {Component} from 'react';
import InputGroup from "../InputGroup";
import PatchControl from "./PatchParams";

class RainParams extends Component {
  render() {
    return (
      <InputGroup name="Rain Options: ">
        Rain:
        <input
          type="checkbox"
          checked={this.props.rainToggle}
          onChange={(e) => this.props.toggleRain(e.target.checked)}/> <br/>
        Drops per second:
        <input
          type="number" step="1" min="0" max="100"
          value={this.props.dps}
          onChange={(e) => this.props.setDPS(parseFloat(e.target.value))}/> <br/>
        <PatchControl
          patch={this.props.rain}
          actions={this.props.patchActions}
          setter={this.props.setRain}
          name="Rain"
        />
      </InputGroup>
    );
  }
}

RainParams.propTypes = {};
RainParams.defaultProps = {};

export default RainParams;
