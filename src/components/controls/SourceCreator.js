import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {point} from "../../utils/point";
import InputGroup from "../helpers/InputGroup";

class SourceCreator extends Component {
  constructor(props) {
    super(props);
    this.start = 0
  }
  render() {
    return (
      <InputGroup name="Create source">
        <div>
          Position:
          <button className="btn btn-sm btn-primary" onClick={() => {
              this.xref.value = (this.props.size.x - 1) / 2;
              this.yref.value = (this.props.size.y - 1) / 2;
            }}>
            Center
          </button> <br/>
          x:
          <input
            type="number" min="1" max={this.props.size.x-1} defaultValue={(this.props.size.x - 1) / 2}
            ref={(ref) => this.xref = ref}/> <br/>
          y:
          <input
            type="number" min="1" max={this.props.size.y-1} defaultValue={(this.props.size.y - 1) / 2}
            ref={(ref) => this.yref = ref}/> <br/>
          amplitude: <br/>
          <input
            type="number" min="0.1" max="1" defaultValue="0.3" step="0.05"
            ref={(ref) => this.amplitude = ref}/> <br/>
          period: <br/>
          <input
            type="number" min="20" max="300" defaultValue="100" step="10"
            ref={(ref) => this.period = ref}/> <br/>
          shift: <br/>
          <input
            type="number" min="0" max="1" defaultValue="0" step="0.05"
            ref={(ref) => this.shift = ref}/> <br/>
          <button className="btn btn-sm btn-primary" onClick={()=>{
            this.props.addSource(
              (this.props.sourceKey == null ? this.start.toString() : this.props.sourceKey),
              point(parseInt(this.xref.value), parseInt(this.yref.value)),
              parseFloat(this.amplitude.value),
              parseFloat(this.period.value),
              parseFloat(this.shift.value));
            this.start += 1;
          }}>
            New source
          </button>
        </div>
      </InputGroup>
    );
  }
}

SourceCreator.propTypes = {};
SourceCreator.defaultProps = {};

export default SourceCreator;
