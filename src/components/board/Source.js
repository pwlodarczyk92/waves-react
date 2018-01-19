export class Source {
  constructor(period, shift) {
    this._period = period;
    this._shift = shift;
    this._value = 0;
    this._targetShift = shift;
    this._targetValue = 1;
  }

  approach(current, target, maxdiff, timestep) {
    const diff = Math.abs(timestep) * maxdiff;
    const abs = Math.abs(target - current);
    const sign = Math.sign(target - current);
    if (abs < diff)
      return target;
    else
      return current + sign * diff;
  }

  approachTarget(timestep) {
    if (this._targetShift !== this._shift)
      this._shift = this.approach(this._shift, this._targetShift, 0.03, timestep);
    if (this._targetValue !== this.value)
      this._value = this.approach(this._value, this._targetValue, 0.03, timestep);
  }

  getPhase(time) {
    return this._shift + time / this._period;
  }

  integrate(time, timestep) {

    const oldPhase = this.getPhase(time);
    const oldValue = this._value;

    this.approachTarget(timestep);
    const newTime = time + timestep;

    const newPhase = this.getPhase(newTime);
    const newValue = this._value;

    const value = (oldValue + newValue) * timestep * this._period / 2;
    const phase = (oldPhase + newPhase) * Math.PI;

    return [value, phase];
  }

  update(data, time) {
    if (data.period !== this._period)
      this.updatePeriod(data.period, time);
    if (data.shift !== this._targetShift)
      this.updateShift(data.shift);
    if (data.value !== this._targetValue)
      this.updateValue(data.value);
  }

  updateShift(newShift) {
    this._targetShift = newShift;
  }

  updateValue(newValue) {
    this._targetValue = newValue;
  }

  updatePeriod(newPeriod, time) {
    const currentPhase = this.getPhase(time);
    this._period = newPeriod;
    const newPhase = this.getPhase(time);

    const diff = currentPhase - newPhase;
    const normalDiff = diff - Math.floor(diff);
    this._shift += normalDiff > 0.5 ? normalDiff : normalDiff - 1;
  }

  isDead() {
    return this._value === 0;
  }

  forceValue(value) {
    this._value = value;
  }
}