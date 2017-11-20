import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './InputGroup.css';
class InputGroup extends Component {
  render() {
    return (
      <div Class='showHide'>
        {this.props.name}
        <input type="checkbox" Class="toggleGroup"/>
        <div Class="fieldsetContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

InputGroup.propTypes = {};
InputGroup.defaultProps = {};

export default InputGroup;
