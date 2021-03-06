import React, {Component} from 'react';
import InputGroup from "../helpers/InputGroup";

class SourcesList extends Component {
  render() {
    const result = [];
    Object.values(this.props.sources).forEach(source => result.push(this.source(source)));
    return (
      <InputGroup name={"Active sources"}>
      <div>{result}</div>
      </InputGroup>
    );
  }
  source(value) {
    return (
      <div className="container" style={{backgroundColor: "#ECD"}}>
        x: {value.position.x}, y: {value.position.y} <br/>
        amplitude: {value.amplitude} <br/>
        period: {value.period} <br/>
        shift: {value.shift} <br/>
      <button className="btn btn-sm btn-danger" onClick={() => this.props.removeSource(value.key)}>remove</button>
    </div>);
  }
}

export default SourcesList;
