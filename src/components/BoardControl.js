import React, {Component} from 'react';
import Board from "./Board";
import BoardColors from "./controls/BoardColors";
import BoardParams from "./controls/BoardParams";
import MouseParams from "./controls/MouseParams";
import RainParams from "./controls/RainParams";
import SimulationParams from "./controls/SimulationParams";

class BoardControl extends Component {
  render() {
    return (
      <div style={{display: "flex"}}>
        <Board {...this.props}/>
        <div style={{flexGrow: 1}}>
          <BoardColors {...this.props}/>
          <BoardParams {...this.props}/>
          <MouseParams {...this.props}/>
          <RainParams {...this.props}/>
          <SimulationParams {...this.props}/>
        </div>
      </div>
    );
  }
}

export default BoardControl;
