class Source {
  constructor(pos, lifetime, period, amplitude) {
    this.pos = pos;
    this.lifetime = lifetime;
    this.period = period;
    this.amplitude = amplitude;
    this.current = 0;
  }

  integrateValue(timestep) {
    console.log(timestep);
    let t0 = this.current;
    if (timestep > this.lifetime - this.current) {
      timestep = this.lifetime - this.current;
      this.current = this.lifetime;
    } else {
      this.current += timestep;
    }
    let t1 = this.current;
    return this.amplitude * timestep * 0.5 * (this.value(t0) + this.value(t1));
  }

  value(time) {
    return Math.sin(time*Math.PI*2/this.period);
  }

  isAlive() {
    console.log(this.lifetime);
    return this.current >= 0 && this.current < this.lifetime;
  }
}

export {Source}