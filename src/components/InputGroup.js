import React, {Component} from 'react';
import './InputGroup.css';
class InputGroup extends Component {
  render() {
    return (
      <div className='showHide'>
        {this.props.name}
        <input type="checkbox" className="toggleGroup"/>
        <div className="fieldsetContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default InputGroup;
