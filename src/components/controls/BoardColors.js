import React, {Component} from 'react';
import {RGB} from "../../utils/color";
import {HIGH_COLOR, LOW_COLOR, ZERO_COLOR} from "../../features/actions";
import InputGroup from "../InputGroup";

class BoardColors extends Component {
  render() {
    return (
      <InputGroup name="Colors: ">
        Positive values:
        <input
          type="color"
          value={RGB.build(this.props.highColor).hex()}
          onChange={(e) => this.props.setColor(RGB.fromText(e.target.value), HIGH_COLOR)}/> <br/>
        Zero values:
        <input
          type="color"
          value={RGB.build(this.props.zeroColor).hex()}
          onChange={(e) => this.props.setColor(RGB.fromText(e.target.value), ZERO_COLOR)}/> <br/>
        Negative values:
        <input
          type="color"
          value={RGB.build(this.props.lowColor).hex()}
          onChange={(e) => this.props.setColor(RGB.fromText(e.target.value), LOW_COLOR)}/> <br/>
      </InputGroup>
    );
  }
}

BoardColors.propTypes = {};
BoardColors.defaultProps = {};

export default BoardColors;
