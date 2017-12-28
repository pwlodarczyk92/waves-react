import React, { Component } from 'react';
import {point} from "../utils/point";
import {Clock} from "./Clock";
import {Wrapper} from "../wasm/board";
import Colors from "./helpers/Colors";
import Effect from "./helpers/Effect";
import Rain from "./helpers/Rain";
import Trace from "./helpers/Trace";
import Trigger from "./helpers/Trigger";
import Sources from "./helpers/Sources";

class App extends Component {
  constructor(props) {
    super(props);

    this.saveModule = this.saveModule.bind(this);
    this.saveRef = this.saveRef.bind(this);
    this.ready = this.ready.bind(this);
    this.step = this.step.bind(this);

    this.applyMove = this.applyMove.bind(this);
    this.applyPress = this.applyPress.bind(this);
    this.applyRain = this.applyRain.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMousePress = this.onMousePress.bind(this);
    this.canvasPos = this.canvasPos.bind(this);

    this.phase = 0;
    this.canvas = null;
    this.moduleLoaded = false;

    this.props.onModuleLoaded(this.saveModule);
  }

  saveModule() {
    this.moduleLoaded = true;

    this.wrapper = new Wrapper(this.props.Module);
    this.board = this.wrapper.makeRegularBoard(this.props.size, this.props.timestep, this.props.acceleration, this.props.damping);
    this.image = this.wrapper.makeImage(this.props.size);
    this.palette = new Colors(this.wrapper, this.props.colors);

    this.movePatch = new Effect(this.wrapper, this.props.moveRadius);
    this.pressPatch = new Effect(this.wrapper, this.props.pressRadius);
    this.rainPatch = new Effect(this.wrapper, this.props.rainRadius);

    this.rain = new Rain(this.board.size, this.applyRain, this.props.dps);
    this.tracer = new Trace();
    this.logger = new Trigger(this.props.fps, (time, fps) => console.log(`Frame rate: ${fps / time}`));
    this.normalizer = new Trigger(this.props.fps, () => this.board.deflectionTable.normalize());
    //this.sources = new Sources((point, amplitude, phase) => this.board.deflectionTable.affine(point, 1, amplitude*Math.sin(phase)));
  }

  saveRef(ref) {
    this.canvas = ref;
  }

  ready() {
    return this.moduleLoaded && this.canvas
  }

  step() {
    if (!this.ready())
      return;

    this.logger.step();
    this.normalizer.step();

    if(!this.props.paused)
      for (let i = 0; i < this.props.spf; i++)
        this.increment();

    this.palette.get().draw(this.board.deflectionTable, this.image);
    this.image.toContext(this.canvas.getContext("2d"));
  }

  increment() {
    this.board.increment();
    if (this.props.rain)
      this.rain.apply(this.props.timestep);
  }

  applyRain(pos) {
    this.rainPatch.get().applyPatch(this.board.deflectionTable, pos, this.props.rainForce);
  }

  applyPress(pos) {
    this.pressPatch.get().applyPatch(this.board.deflectionTable, pos, this.props.pressForce);
  }

  applyMove(pos) {
    this.movePatch.get().applyPatch(this.board.deflectionTable, pos, this.props.moveForce);
  }

  onMouseMove(event) {
    if (!this.ready() || !this.props.trace)
      return;

    const time = new Date().getTime();
    const position = this.canvasPos(event, this.canvas);
    for (let pos of this.tracer.trace(position, time))
      this.applyMove(pos);
  }

  onMousePress(event) {
    if (!this.ready())
      return;

    const newPos = this.canvasPos(event, this.canvas);
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
    this.rain.dps = nextProps.dps;
    this.board.timestep = nextProps.timestep;
    this.board.acceleration = nextProps.acceleration;
    this.board.damping = nextProps.damping;
    this.movePatch.update(nextProps.moveRadius);
    this.pressPatch.update(nextProps.pressRadius);
    this.rainPatch.update(nextProps.rainRadius);
    this.palette.update(nextProps.colors);
    this.logger.update(nextProps.fps);
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
        <Clock
          delay={1000 / this.props.fps}
          function={this.step}/>
      </div>
    );
  }
}

export default App;
