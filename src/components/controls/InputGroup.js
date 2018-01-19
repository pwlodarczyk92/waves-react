import React, {Component} from 'react';
import '../InputGroup.css';

class InputGroup extends Component {
  constructor(props) {
    super(props);
    this.idx = Math.random().toString();
  }

  render() {
    return (
      <div>
        <a
          className="btn btn-sm btn-outline-primary"
          data-toggle="collapse"
          href={`#${this.idx}`}
          role="button">
          {this.props.name}
        </a>
        <div
          className="collapse"
          style={{backgroundColor: "#DEC"}}
          id={this.idx}>
          <div className="p-2">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default InputGroup;
