import React, { Component } from 'react';
import {point} from "../utils/point";
import {Clock} from "./Clock";

class App extends Component {
  constructor(props) {
    super(props);

    this.ready = this.ready.bind(this);
    this.saveModule = this.saveModule.bind(this);
    this.saveRef = this.saveRef.bind(this);

    this.start = this.start.bind(this);
    this.step = this.step.bind(this);
    this.stop = this.stop.bind(this);
    
    this.radialPatch = this.radialPatch.bind(this);
    this.movePatch = this.movePatch.bind(this);
    this.clickPatch = this.clickPatch.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMousePress = this.onMousePress.bind(this);
    this.canvasPos = this.canvasPos.bind(this);

    this.ref = null;
    this.mouseRadius = 5;
    this.pressRadius = 10;
    this.props.onModuleLoaded(this.saveModule);
  }

  saveModule() {
    this.moduleLoaded = true;

    this.set_timestep = this.props.Module.cwrap('set_timestep', null, ['number', 'number']);
    this.get_time = this.props.Module.cwrap('get_time', 'number', ['number']);

    this.make_board = this.props.Module.cwrap('make_regular_board', 'number', ['number', 'number', 'number', 'number', 'number']);
    this.make_patch = this.props.Module.cwrap('make_table', 'number', ['number', 'number', 'number']);
    this.make_image = this.props.Module.cwrap('make_image', 'number', ['number', 'number']);

    this.velocity_patch = this.props.Module.cwrap('velocity_table', 'number', ['number']);
    this.deflection_patch = this.props.Module.cwrap('deflection_table', 'number', ['number']);

    this.increment = this.props.Module.cwrap('increment', null, ['number']);
    this.draw_board = this.props.Module.cwrap('draw_board', null, ['number', 'number']);
    this.apply = this.props.Module.cwrap('apply_patch', null, ['number', 'number', 'number', 'number', 'number']);

    this.board_ptr = this.make_board(this.props.size.x, this.props.size.y, this.props.acceleration, this.props.damping, this.props.timestep);
    this.velocity_ptr = this.velocity_patch(this.board_ptr);
    this.deflection_ptr = this.deflection_patch(this.board_ptr);

    this.image_ptr = this.make_image(this.props.size.x, this.props.size.y);
    this.image_array = new Uint8ClampedArray(this.props.Module.HEAPU8.buffer, this.image_ptr, this.props.size.x * this.props.size.y * 4);
    this.move_ptr = this.radialPatch(this.mouseRadius);
    this.press_ptr = this.radialPatch(this.pressRadius);

    this.start();
  }

  ready() {
    return this.moduleLoaded && this.ref
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

  start() {
    if (!this.ready())
      return;

    this.forceUpdate();
    this.lastTime = new Date().getTime();
    this.iters = 0;
    this.incrs = 0;
  }

  step() {
    this.iters += 1;
    if (this.iters % this.props.fps === 0) {
      const newTime = new Date().getTime();
      console.log((newTime - this.lastTime));
      this.lastTime = newTime;
    }

    for (let i = 0; i < this.props.spf; i++)
      this.incr();

    this.draw_board(this.board_ptr, this.image_ptr);
    const imgData = new ImageData(this.image_array, this.props.size.x, this.props.size.y);
    this.ctx.putImageData(imgData, 0, 0);
  }

  incr() {
    const p = this.props.size.mul(0.5, 0.5).floor().sub(point(this.mouseRadius, this.mouseRadius));
    const amplitude = this.props.timestep*4;
    const phase = this.get_time(this.board_ptr)*0.04;
    this.apply(this.deflection_ptr, this.move_ptr, p.x, p.y, Math.sin(phase)*amplitude);
    this.increment(this.board_ptr);
  }

  stop() {
    window.clearInterval(this.stepId);
  }


  radialPatch(radius) {
    const size = radius*2+1;
    const view = new Float32Array(size * size);
    const factor = 4/(radius * radius);
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const dp = point(dx, dy);
        const p = dp.add(point(radius, radius));
        if (dp.norm() <= radius)
          view[size * p.y + p.x] = factor * (Math.cos(Math.PI * dp.norm() / radius) + 1);
        else
          view[size * p.y + p.x] = 0;
      }
    }

    const bytes = view.length*view.BYTES_PER_ELEMENT;
    const ptr = this.props.Module._malloc(bytes);
    const heap = new Float32Array(this.props.Module.HEAPU32.buffer, ptr, bytes);
    heap.set(view);

    return this.make_patch(size, size, ptr);
  }

  clickPatch(pos) {
    this.apply(this.deflection_ptr, this.press_ptr, pos.x - this.pressRadius, pos.y - this.pressRadius, this.pressRadius*this.pressRadius);
  }

  movePatch(pos) {
    this.apply(this.deflection_ptr, this.move_ptr, pos.x - this.mouseRadius, pos.y - this.mouseRadius, 1);
  }

  onMouseMove(event) {
    if (!this.moduleLoaded || !this.ref)
      return;

    const newPos = this.canvasPos(event, this.ref);
    const newMoveTime = new Date().getTime();

    if (
      this.lastMoveTime === undefined ||
      newMoveTime - this.lastMoveTime > 250) {
      this.movePatch(newPos);
    } else if (this.lastPos.norm(newPos) > 0.5) {
      const num = Math.floor(this.lastPos.norm(newPos));
      for (let i = 0; i <= num; i++) {
        const p = newPos.affine(i/num, this.lastPos).round();
        this.movePatch(p);
      }
    }
    this.lastPos = newPos;
    this.lastMoveTime = newMoveTime;
  }

  onMousePress(event) {
    if (!this.moduleLoaded || !this.ref)
      return;
    const newPos = this.canvasPos(event, this.ref);
    this.clickPatch(newPos);
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
      this.set_timestep(this.board_ptr, nextProps.timestep);
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
                delay={1000 / this.props.fps}
                function={() => {this.clickPatch(this.props.size.random().floor());}}/>
        }
      </div>
    );
  }
}

export default App;
