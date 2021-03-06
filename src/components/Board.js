import React, { Component } from 'react';
import {point} from "../utils/point";
import {Clock} from "./helpers/Clock";
import {Wrapper} from "../wasm/board";
import Colors from "./board/Colors";
import Effect from "./board/Effect";
import Rain from "./board/Rain";
import Trace from "./board/Tracer";
import Trigger from "./board/Trigger";
import Sources from "./board/Sources";

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

    this.movePatch = new Effect(this.wrapper, this.props.trace.radius);
    this.pressPatch = new Effect(this.wrapper, this.props.press.radius);
    this.rainPatch = new Effect(this.wrapper, this.props.rain.radius);

    this.rain = new Rain(this.board.size, this.applyRain, this.props.dps);
    this.tracer = new Trace();
    this.logger = new Trigger(this.props.fps, (time, fps) => console.log(`Frame rate: ${1000 * fps / time}`));
    this.normalizer = new Trigger(this.props.fps, () => {if (this.props.normalize) this.board.deflectionTable.normalize();});
    this.sources = new Sources(
      this.props.sources,
      (point, amplitude, phase) => this.board.deflectionTable.affine(point, 1, amplitude*Math.sin(phase)),
      this.props.removeSource
    );

  }

  saveRef(ref) {
    this.canvas = ref;
  }

  ready() {
    return this.moduleLoaded && this.canvas
  }

  reset() {
    this.board.deflectionTable.clear(0);
    this.board.velocityTable.clear(0);
    this.sources.clear();
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
    this.sources.increment(this.board.time, this.props.timestep);
    this.board.increment();
    if (this.props.rainToggle)
      this.rain.apply(this.props.timestep);
  }

  applyRain(pos) {
    this.rainPatch.get().applyPatch(this.board.deflectionTable, pos, this.props.rain.force);
  }

  applyPress(pos) {
    this.pressPatch.get().applyPatch(this.board.deflectionTable, pos, this.props.press.force);
  }

  applyMove(pos) {
    this.movePatch.get().applyPatch(this.board.deflectionTable, pos, this.props.trace.force);
  }

  onMouseMove(event) {
    if (!this.ready() || !this.props.traceToggle)
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
    if (this.moduleLoaded)
      this.readProps(nextProps);
    else
      this.propsWaiting = nextProps;
  }

  readProps(nextProps) {
    this.propsWaiting = null;
    this.rain.dps = nextProps.dps;
    this.board.timestep = nextProps.timestep;
    this.board.acceleration = nextProps.acceleration;
    this.board.damping = nextProps.damping;
    this.movePatch.update(nextProps.trace.radius);
    this.pressPatch.update(nextProps.press.radius);
    this.rainPatch.update(nextProps.rain.radius);
    this.palette.update(nextProps.colors);
    this.sources.update(nextProps.sources);
    this.logger.update(nextProps.fps);
  }

  render() {
    if (this.propsWaiting != null && this.moduleLoaded)
      this.readProps(this.propsWaiting);

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
