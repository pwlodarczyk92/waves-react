import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Trigger {
  constructor(fps, action) {
    this.update = this.update.bind(this);
    this.step = this.step.bind(this);

    this.action = action;
    this.fps = fps;
    this.frame = 0;
    this.time = new Date().getTime();
    this.cycles = 0;
  }
  update(fps) {
    this.fps = fps;
  }
  step() {
    this.frame += 1;
    if (this.frame === this.fps) {
      const newTime = new Date().getTime();
      this.action(newTime - this.time, this.fps, this.cycles);
      this.time = newTime;
      this.frame = 0;
    }
  }
}

Trigger.propTypes = {};
Trigger.defaultProps = {};

export default Trigger;
