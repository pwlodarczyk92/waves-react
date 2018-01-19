import React, {Component} from 'react';
import InputGroup from "../helpers/InputGroup";
import PatchControl from "./PatchParams";

class RainParams extends Component {
  render() {
    return (
      <InputGroup name="Rain options">
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

export default RainParams;
