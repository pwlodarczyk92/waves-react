import React, { Component } from 'react';
import {point} from "../utils/point";
import {Clock} from "./Clock";
import {Wrapper} from "../wasm/board";
import {poissrand} from "../utils/poisson";
import {RGB} from "../utils/color";
import {Source} from "../utils/source";

class App extends Component {
  constructor(props) {
    super(props);

    this.saveModule = this.saveModule.bind(this);
    this.saveRef = this.saveRef.bind(this);
    this.ready = this.ready.bind(this);
    this.step = this.step.bind(this);

    this.applyMove = this.applyMove.bind(this);
    this.applyPress = this.applyPress.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMousePress = this.onMousePress.bind(this);
    this.canvasPos = this.canvasPos.bind(this);

    this.ref = null;
    this.moduleLoaded = false;

    this.lastRealTime = new Date().getTime();
    this.lastTime = 0;
    this.frames = 0;
    this.props.onModuleLoaded(this.saveModule);
  }

  saveModule() {
    this.moduleLoaded = true;
    this.wrapper = new Wrapper(this.props.Module);
    this.board = this.wrapper.makeRegularBoard(this.props.size, this.props.timestep, this.props.acceleration, this.props.damping);
    this.image = this.wrapper.makeImage(this.props.size);
    this.palette = this.wrapper.makePalette(App.colorsList([this.props.lowColor, this.props.zeroColor, this.props.highColor]));

    this.movePatch = this.wrapper.makeRadialPatch(this.props.moveRadius, App.radfun);
    this.pressPatch = this.wrapper.makeRadialPatch(this.props.pressRadius, App.radfun);
    this.rainPatch = this.wrapper.makeRadialPatch(this.props.rainRadius, App.radfun);
    this.sources = [];

    /*this.memtest = [];
    for (let i = 0; i < 10000; i++) {
      this.memtest.push(this.wrapper.makeRadialPatch(this.props.pressRadius, radfun));
    }*/
  }

  saveRef(ref) {
    this.ref = ref;
  }

  ready() {
    return this.moduleLoaded && this.ref
  }

  step() {
    if (!this.ready())
      return;

    this.frames += 1;
    if (this.frames % this.props.fps === 0) {
      const newRealTime = new Date().getTime();
      console.log((newRealTime - this.lastRealTime));
      this.lastRealTime = newRealTime;
      this.board.deflectionTable.normalize();
    }

    if(!this.props.paused)
      for (let i = 0; i < this.props.spf; i++)
        this.increment();

    //this.image.draw(this.board.deflectionTable);
    this.palette.draw(this.board.deflectionTable, this.image);
    this.image.toContext(this.ref.getContext("2d"));
  }

  increment() {
    this.board.increment();
    if (this.props.rain && this.props.timestep > 0) {
      const lambda = this.props.timestep * this.props.dps / this.props.fps;
      const drops = poissrand(lambda);
      for (let i = 0; i < drops; i++)
        this.applyRain(this.props.size.random().floor());
    }

    const aliveSources = [];
    while (this.sources.length > 0) {
      const source = this.sources.pop();
      const value = source.integrateValue(this.props.timestep);
      if (source.isAlive())
        aliveSources.push(source);
      this.movePatch.applyPatch(this.board.deflectionTable, source.pos, value);
    }
    this.sources = aliveSources;
    //const p = this.props.size.mul(0.5, 0.5).floor().sub(point(this.moveRadius, this.moveRadius));
    //const amplitude = this.props.timestep*4;
    //const phase = this.get_time(this.board_ptr)*0.04;
    //this.apply(this.deflection_ptr, this.move_ptr, p.x, p.y, Math.sin(phase)*amplitude);

  }

  applyRain(pos) {
    this.rainPatch.applyPatch(this.board.deflectionTable, pos, this.props.rainForce);
  }

  applyPress(pos) {
    this.pressPatch.applyPatch(this.board.deflectionTable, pos, this.props.pressForce);
  }

  applyMove(pos) {
    this.movePatch.applyPatch(this.board.deflectionTable, pos, this.props.moveForce);
  }

  onMouseMove(event) {
    if (!this.ready() || !this.props.trace)
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
    if (nextProps.timestep !== this.props.timestep)
      this.board.timestep = nextProps.timestep;
    if (nextProps.acceleration !== this.props.acceleration)
      this.board.acceleration = nextProps.acceleration;
    if (nextProps.damping !== this.props.damping)
      this.board.damping = nextProps.damping;
    if (nextProps.moveRadius !== this.props.moveRadius) {
      this.movePatch.free();
      this.movePatch = this.wrapper.makeRadialPatch(nextProps.moveRadius, App.radfun);
    }
    if (nextProps.pressRadius !== this.props.pressRadius) {
      this.pressPatch.free();
      this.pressPatch = this.wrapper.makeRadialPatch(nextProps.pressRadius, App.radfun);
    }
    if (nextProps.rainRadius !== this.props.rainRadius) {
      this.rainPatch.free();
      this.rainPatch = this.wrapper.makeRadialPatch(nextProps.rainRadius, App.radfun);
    }
    if (!RGB.equals(nextProps.lowColor, this.props.lowColor) ||
        !RGB.equals(nextProps.zeroColor, this.props.zeroColor) ||
        !RGB.equals(nextProps.highColor, this.props.highColor)) {
      const colorsList = App.colorsList([nextProps.lowColor, nextProps.zeroColor, nextProps.highColor]);
      this.palette.free();
      this.palette = this.wrapper.makePalette(colorsList);
    }
  }

  static radfun(dp, radius) {
    return 0.5*(Math.cos(Math.PI * dp.norm() / radius) + 1);
  }

  static colorsList(colors) {
    const result = [];
    const len = 256;
    for (let curr = 0; curr < colors.length - 1; curr++) {
      const lastCol = RGB.build(colors[curr]);
      const nextCol = RGB.build(colors[curr+1]);
      for (let i = 0; i <= len; i++)
        result.push(lastCol.mix(i / len, nextCol));
    }
    return result;
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
