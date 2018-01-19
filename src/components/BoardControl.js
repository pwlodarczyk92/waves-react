import React, {Component} from 'react';
import Board from "./Board";
import BoardColors from "./controls/BoardColors";
import BoardParams from "./controls/BoardParams";
import MouseParams from "./controls/MouseParams";
import RainParams from "./controls/RainParams";
import SimulationParams from "./controls/SimulationParams";
import SourceCreator from "./controls/SourceCreator";
import SourcesList from "./controls/SourcesList";

class BoardControl extends Component {
  render() {
    return (
      <div className="row no-gutters">
        <div className="col-lg-auto">
          <Board {...this.props} ref={(ref) => this.board = ref}/>
        </div>
        <div className="col-lg">
          <button className="btn btn-sm btn-danger" onClick={() => {
            if (this.board)
              this.board.reset();
          }}>Reset
          </button>
          <BoardColors {...{...this.props, ...this.props.colors}}/>
          <BoardParams {...this.props}/>
          <MouseParams {...this.props}/>
          <RainParams {...this.props}/>
          <SimulationParams {...this.props}/>
          <SourceCreator {...this.props}/>
          <SourcesList {...this.props}/>
        </div>
      </div>
    );
  }
}

export default BoardControl;
