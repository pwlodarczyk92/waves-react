import React, { Component } from 'react';
import {point} from "../utils/point";
import {Clock} from "./Clock";
import {Wrapper} from "../wasm/board";

class App extends Component {
  constructor(props) {
    super(props);

    this.ready = this.ready.bind(this);
    this.saveModule = this.saveModule.bind(this);
    this.saveRef = this.saveRef.bind(this);

    this.start = this.start.bind(this);
    this.step = this.step.bind(this);

    this.applyMove = this.applyMove.bind(this);
    this.applyPress = this.applyPress.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMousePress = this.onMousePress.bind(this);
    this.canvasPos = this.canvasPos.bind(this);

    this.ref = null;
    this.lastTime = new Date().getTime();
    this.iters = 0;
    this.props.onModuleLoaded(this.saveModule);
  }

  saveModule() {
    this.moduleLoaded = true;

    this.wrapper = new Wrapper(this.props.Module);
    this.board = this.wrapper.makeRegularBoard(this.props.size, this.props.timestep, this.props.acceleration, this.props.damping);
    this.image = this.wrapper.makeImage(this.props.size);

    const radfun = (dp, radius) => 0.5*(Math.cos(Math.PI * dp.norm() / radius) + 1);
    this.movePatch = this.wrapper.makeRadialPatch(this.props.mouseRadius, radfun);
    this.pressPatch = this.wrapper.makeRadialPatch(this.props.pressRadius, radfun);

    this.start();
  }

  saveRef(ref) {
    this.ref = ref;
    if (ref !== null) {
      this.ctx = ref.getContext("2d");
      this.start();
    }
    else {
      this.stop();
    }
  }

  ready() {
    return this.moduleLoaded && this.ref
  }

  start() {
    if (this.ready())
      this.forceUpdate();
  }

  step() {
    this.iters += 1;
    if (this.iters % this.props.fps === 0) {
      const newTime = new Date().getTime();
      console.log((newTime - this.lastTime));
      this.lastTime = newTime;
      this.board.deflectionTable.normalize();
    }

    for (let i = 0; i < this.props.spf; i++)
      this.incr();

    this.image.draw(this.board.deflectionTable);
    this.image.toContext(this.ctx);
  }

  incr() {
    //const p = this.props.size.mul(0.5, 0.5).floor().sub(point(this.mouseRadius, this.mouseRadius));
    //const amplitude = this.props.timestep*4;
    //const phase = this.get_time(this.board_ptr)*0.04;
    //this.apply(this.deflection_ptr, this.move_ptr, p.x, p.y, Math.sin(phase)*amplitude);
    this.board.increment();
  }

  applyPress(pos) {
    this.pressPatch.applyPatch(this.board.deflectionTable, pos, this.props.pressRadius);
  }

  applyMove(pos) {
    this.movePatch.applyPatch(this.board.deflectionTable, pos, 1);
  }

  onMouseMove(event) {
    if (!this.moduleLoaded || !this.ref)
      return;

    const newPos = this.canvasPos(event, this.ref);
    const newMoveTime = new Date().getTime();

    if (
      this.lastMoveTime === undefined ||
      newMoveTime - this.lastMoveTime > 250) {
      this.applyMove(newPos);
    } else if (this.lastPos.norm(newPos) > 0.5) {
      const num = Math.floor(this.lastPos.norm(newPos));
      for (let i = 0; i < num; i++) {
        const p = newPos.affine(i/num, this.lastPos).round();
        this.applyMove(p);
      }
    }
    this.lastPos = newPos;
    this.lastMoveTime = newMoveTime;
  }

  onMousePress(event) {
    if (!this.moduleLoaded || !this.ref)
      return;
    const newPos = this.canvasPos(event, this.ref);
    this.applyPress(newPos);
  }

  canvasPos(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const xfactor = this.props.size.x/this.props.width;
    const yfactor = this.props.size.y/this.props.height;
    return point(
      Math.floor((event.clientX - rect.left) * xfactor),
      Math.floor((event.clientY - rect.top ) * yfactor));
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log(this.props);
    if (nextProps.timestep !== this.props.timestep)
      this.board.timestep = nextProps.timestep;
    if (nextProps.acceleration !== this.props.acceleration)
      this.board.acceleration = nextProps.acceleration;
    if (nextProps.damping !== this.props.damping)
      this.board.damping = nextProps.damping;
  }

  render() {
    return (
      <div>
        <canvas
          ref={this.saveRef}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMousePress}
          width={this.props.size.x}
          height={this.props.size.y}
          style={{
            width: this.props.width,
            height: this.props.height,
            margin: 0,
            padding: 0,
            border: 0
          }}
        />
        {
          !this.ready() ? null :
            <Clock
              delay={1000 / this.props.fps}
              function={this.step}/>
        }
        {
          !this.props.rain ? null :
              <Clock
                delay={1000 / 3}
                function={() => {this.applyPress(this.props.size.random().floor());}}/>
        }
      </div>
    );
  }
}

export default App;
