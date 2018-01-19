/* global Module, onModuleLoaded */

import React, {Component} from 'react';
import BoardControl from "./BoardControl";
import {point} from "../utils/point";

class URLBoard extends Component {
  render() {
    return (
      <BoardControl
        size={point(401, 301)}
        width={800}
        height={600}
        Module={Module}
        onModuleLoaded={onModuleLoaded}
        {...this.props}/>
    );
  }
}


export default URLBoard;
