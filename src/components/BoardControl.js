import React, {Component} from 'react';
import Board from "./Board";
import InputGroup from "./InputGroup";
import {HIGH_COLOR, LOW_COLOR, ZERO_COLOR} from "../features/actions";
import {RGB} from "../utils/color";

class BoardControl extends Component {
  render() {
    return (
      <div style={{display: "flex"}}>
        <Board {...this.props}/>
        <div style={{flexGrow: 1}}>
          <InputGroup name={"Colors: "}>
            Positive values:
            <input
              type="color"
              value={RGB.build(this.props.highColor).hex()}
              onChange={(e) => this.props.setColor(RGB.fromText(e.target.value), HIGH_COLOR)}/> <br/>
            Zero values:
            <input
              type="color"
              value={RGB.build(this.props.zeroColor).hex()}
              onChange={(e) => this.props.setColor(RGB.fromText(e.target.value), ZERO_COLOR)}/> <br/>
            Negative values:
            <input
              type="color"
              value={RGB.build(this.props.lowColor).hex()}
              onChange={(e) => this.props.setColor(RGB.fromText(e.target.value), LOW_COLOR)}/> <br/>
            Mouse trace:
          </InputGroup>
          <InputGroup name={"Basic: "}>
            Timestep:
            <input
              type="number" step="0.01" min="-1" max="1"
              value={this.props.timestep}
              onChange={(e) => this.props.setTimestep(parseFloat(e.target.value))}/> <br/>
            Damping:
            <input
              type="number" step="0.0005" min="0" max="0.1"
              value={this.props.damping}
              onChange={(e) => this.props.setDamping(parseFloat(e.target.value))}/> <br/>
            Pause:
            <input
              type="checkbox"
              checked={this.props.paused}
              onChange={(e) => this.props.togglePaused(e.target.checked)}/> <br/>
            Mouse trace:
            <input
              type="checkbox"
              checked={this.props.trace}
              onChange={(e) => this.props.toggleTrace(e.target.checked)}/> <br/>
            Rain:
            <input
              type="checkbox"
              checked={this.props.rain}
              onChange={(e) => this.props.toggleRain(e.target.checked)}/> <br/>
            Drops per second:
            <input
              type="number" step="0.1" min="0" max="10"
              value={this.props.dps}
              onChange={(e) => this.props.setDPS(parseFloat(e.target.value))}/> <br/>
          </InputGroup>
          <InputGroup name={"Advanced: "}>
            Acceleration:
            <input
              type="number" step="0.01" min="0" max="2"
              value={this.props.acceleration}
              onChange={(e) => this.props.setAcceleration(parseFloat(e.target.value))}/> <br/>
            FPS:
            <input
              type="number" step="1" min="10" max="120"
              value={this.props.fps}
              onChange={(e) => this.props.setFPS(parseInt(e.target.value, 10))}/> <br/>
            Steps per frame:
            <input
              type="number" step="1" min="1" max="10"
              value={this.props.spf}
              onChange={(e) => this.props.setSPF(parseInt(e.target.value, 10))}/> <br/>
          </InputGroup>
          <InputGroup name={"Input: "}>
            Raindrop radius:
            <input
              type="number" step="1" min="1" max="20"
              value={this.props.rainRadius}
              onChange={(e) => this.props.setRainRadius(parseFloat(e.target.value))}/> <br/>
            Click radius:
            <input
              type="number" step="1" min="1" max="20"
              value={this.props.pressRadius}
              onChange={(e) => this.props.setPressRadius(parseFloat(e.target.value))}/> <br/>
            Mouse trace radius:
            <input
              type="number" step="1" min="1" max="20"
              value={this.props.moveRadius}
              onChange={(e) => this.props.setMoveRadius(parseFloat(e.target.value))}/> <br/>
            Raindrop strength:
            <input
              type="number" step="0.5" min="1" max="50"
              value={this.props.rainForce}
              onChange={(e) => this.props.setRainForce(parseFloat(e.target.value))}/> <br/>
            Click strength:
            <input
              type="number" step="0.5" min="1" max="50"
              value={this.props.pressForce}
              onChange={(e) => this.props.setPressForce(parseFloat(e.target.value))}/> <br/>
            Mouse trace strength:
            <input
              type="number" step="0.05" min="0.1" max="5"
              value={this.props.moveForce}
              onChange={(e) => this.props.setMoveForce(parseFloat(e.target.value))}/> <br/>
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default BoardControl;
