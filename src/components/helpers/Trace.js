import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Trace {
  constructor() {
    this.lastPosition = null;
    this.lastTime = null;
  }
  trace(position, time) {
    const result = [];
    if (this.lastTime === null || time - this.lastTime > 250) {
      result.push(position);
    } else if (this.lastPosition.norm(position) > 0.5) {
      const num = Math.floor(this.lastPosition.norm(position));
      for (let i = 0; i < num; i++)
        result.push(position.affine(i/num, this.lastPosition).round());
    }
    if (result.length > 0) {
      this.lastPosition = position;
      this.lastTime = time;
    }
    return result;
  }
}

Trace.propTypes = {};
Trace.defaultProps = {};

export default Trace;
