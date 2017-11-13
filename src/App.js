import React, { Component } from 'react';
import {point} from "./utils/point";

class App extends Component {
  constructor(props) {
    super(props);

    this.props.onModuleLoaded(() => {
      console.log("LOADED");

      const arr = this.props.Module.cwrap('arr', 'number',['number','number']);
      const alloc = this.props.Module.cwrap('alloc', 'number', ['number', 'number']);
      const typedArray = new Int32Array([1, 2, 3, 4, 5]);
      const heapBytes = this.arrayToHeap(typedArray);
      const ret = this.props.Module.ccall('arr', 'number',['number','number'], [heapBytes.byteOffset, typedArray.length]);
      console.log("result: " + heapBytes);
      console.log("result: " + ret);
      const ptr = alloc(3, 8);
      const newBytes = new Uint32Array(this.props.Module.HEAPU8.buffer, ptr, 3);
      console.log(newBytes);
    });

    this.canvasPos = this.canvasPos.bind(this);
    this.saveRef = this.saveRef.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.mouseEffect = this.mouseEffect.bind(this);
    this.setd = this.setd.bind(this);
    this.setv = this.setv.bind(this);
    this.getd = this.getd.bind(this);
    this.getv = this.getv.bind(this);
    this.addd = this.addd.bind(this);
    this.addv = this.addv.bind(this);
    this.muld = this.muld.bind(this);
    this.mulv = this.mulv.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.step = this.step.bind(this);
    this.ref = null;
  }

  arrayToHeap(typedArray){
    const numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
    const ptr = this.props.Module._malloc(numBytes);
    const heapBytes = new Uint8Array(this.props.Module.HEAPU8.buffer, ptr, numBytes);
    heapBytes.set(new Uint8Array(typedArray.buffer));
    return heapBytes;
  }

  setd(x, y, d) {
    this.deflection[this.props.xsize * y + x] = d;
  }
  setv(x, y, v) {
    this.velocity[this.props.xsize * y + x] = v;
  }
  addd(x, y, d) {
    this.deflection[this.props.xsize * y + x] += d;
  }
  addv(x, y, v) {
    this.velocity[this.props.xsize * y + x] += v;
  }
  muld(x, y, d) {
    this.deflection[this.props.xsize * y + x] *= d;
  }
  mulv(x, y, v) {
    this.velocity[this.props.xsize * y + x] *= v;
  }
  getd(x, y) {
    return this.deflection[this.props.xsize * y + x];
  }
  getv(x, y) {
    return this.velocity[this.props.xsize * y + x];
  }

  start() {
    console.log("start");
    this.deflection = [];
    this.velocity = [];
    for (let i = 0; i < this.props.ysize * this.props.xsize; i++) {
      this.deflection[i] = 0.5;
      this.velocity[i] = 0;
    }
    this.stepId = setInterval(this.step, 1000/this.props.fps);
    this.lastTime = new Date().getTime();
    this.iters = 0;
  }

  step() {
    for (let y = 1; y < this.props.ysize-1; y++) {
      for (let x = 1; x < this.props.xsize-1; x++) {
        const meand = this.getd(x, y + 1) + this.getd(x, y - 1) + this.getd(x - 1, y) + this.getd(x + 1, y);
        this.addv(x, y, (meand - 4 * this.getd(x, y)) * this.props.acceleration);
      }
    }
    for (let y = 1; y < this.props.ysize-1; y++) {
      for (let x = 1; x < this.props.xsize-1; x++) {
        this.addd(x, y, this.getv(x, y));
      }
    }
    for (let y = 1; y < this.props.ysize-1; y++) {
      for (let x = 1; x < this.props.xsize-1; x++) {
        this.mulv(x, y, (1-this.props.damping));
      }
    }
    const ctx = this.ref.getContext("2d");
    const imgData = ctx.createImageData(this.props.xsize, this.props.ysize);
    const data = imgData.data;

    for (let y = 0; y < this.props.ysize; y++) {
      for (let x = 0; x < this.props.xsize; x++) {
        data[(this.props.xsize * y + x) * 4] = this.getd(x, y)*255;
        data[(this.props.xsize * y + x) * 4 + 3 ] = 255;
      }
    }
    this.iters = this.iters + 1;
    if (this.iters >= this.props.fps)
      this.iters = 0;
    if (this.iters === 0) {
      const newTime = new Date().getTime();
      const timeDiff = newTime - this.lastTime;
      console.log(timeDiff);
      this.lastTime = newTime;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  stop() {
    window.clearInterval(this.stepId);
  }

  saveRef(ref) {
    this.ref = ref;
    if (ref !== null)
      this.start();
    else
      this.stop();
  }

  mouseEffect(pos) {
    const rmax = 5;
    const factor = 0.1 / rmax * rmax;
    for (let dx = -rmax; dx <= rmax; dx++) {
      for (let dy = -rmax; dy <= rmax; dy++) {
        const dp = point(dx, dy);
        const p = dp.add(pos);
        if (dp.norm() > rmax || p.x < 0 || p.y < 0 || p.x >= this.props.xsize || p.y >= this.props.ysize)
          continue;
        this.addd(p.x, p.y, factor * (Math.cos(Math.PI * dp.norm() / rmax) + 1));
      }
    }
  }

  onMouseMove(event) {
    if (this.ref === null)
      return;

    const newPos = this.canvasPos(event, this.ref);
    const newMoveTime = new Date().getTime();

    if (this.lastMoveTime === undefined || newMoveTime - this.lastMoveTime > 250) {
      this.mouseEffect(newPos);
    } else {
      const num = Math.floor(this.lastPos.norm(newPos));
      for (let i = 0; i <= num; i++) {
        const p = newPos.affine(i/num, this.lastPos).round();
        this.mouseEffect(p);
      }
    }
    this.lastPos = newPos;
    this.lastMoveTime = newMoveTime;
  }

  canvasPos(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const xfactor = this.props.xsize/this.props.width;
    const yfactor = this.props.ysize/this.props.height;
    return point(
      Math.floor((event.clientX - rect.left) * xfactor),
      Math.floor((event.clientY - rect.top ) * yfactor));
  }

  render() {
    return (
      <canvas ref={this.saveRef}
              onMouseMove={this.onMouseMove}
              width={this.props.xsize}
              height={this.props.ysize}
              style={{
                width: this.props.width,
                height: this.props.height,
                margin: 0,
                padding: 0,
                border: 0
              }}
      />
    );
  }
}

export default App;
