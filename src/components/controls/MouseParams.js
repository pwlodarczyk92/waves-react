import React, {Component} from 'react';
import InputGroup from "../InputGroup";
import PatchControl, {bigPatchInput, smallPatchInput} from "./PatchParams";

class MouseParams extends Component {
  render() {
    return (
      <InputGroup name="Input: ">
        Mouse trace:
        <input
          type="checkbox"
          checked={this.props.traceToggle}
          onChange={(e) => this.props.toggleTrace(e.target.checked)}/> <br/>
        <PatchControl
          patch={this.props.trace}
          actions={this.props.patchActions}
          setter={this.props.setTrace}
          input={smallPatchInput}
          name={"Tracer"}/>
        <PatchControl
          patch={this.props.press}
          actions={this.props.patchActions}
          setter={this.props.setPress}
          input={bigPatchInput}
          name={"Press"}/>
      </InputGroup>
    );
  }
}

MouseParams.propTypes = {};
MouseParams.defaultProps = {};

export default MouseParams;
