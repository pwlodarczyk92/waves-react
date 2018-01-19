import {Source} from './Source';

class Sources {
  constructor(sources, effect, remove) {
    this.sources = {};
    this.effect = effect;
    this.remove = remove;
    this.dyingSources = [];
    this.update(sources);
  }

  increment(time, timestep) {

    const stillDying = [];
    for (const {data, source} of this.dyingSources) {
      let [value, phase] = source.integrate(time, timestep);
      this.effect(data.position, data.amplitude * value, phase);

      if (!source.isDead())
        stillDying.push({data, source});
    }
    this.dyingSources = stillDying;

    for (let [key, {data, source}] of Object.entries(this.sources)) {
      let [value, phase] = source.integrate(time, timestep);
      this.effect(data.position, data.amplitude * value, phase);

      let shouldKill = data.start != null && time < data.startTime;
      shouldKill |= data.end != null && time > data.endTime;
      if (shouldKill)
        this.kill(key);
    }
  }

  kill(key) {
    const {data, source} = this.sources[key];
    source.updateValue(0);
    this.dyingSources.push({data, source});
    delete this.sources[key];
  }

  update(sources) {
    console.log(sources);
    if (this.sources === sources)
      return;
    const allKeys = new Set(Object.keys(this.sources));
    Object.keys(sources).forEach(k => allKeys.add(k));

    for (const key of allKeys) {
      if (!sources[key]) {
        this.kill(key);
      } else if (!this.sources[key]) {
        console.log("new: ");
        console.log(sources[key]);
        this.sources[key] = {
          data: sources[key],
          source: new Source(sources[key].period, sources[key].shift),
        };
      } else if (this.sources[key].data !== sources[key]) {
        this.sources[key].data = sources[key];
        this.sources[key].source.update(sources[key]);
      }
    }
  }

  clear() {
    this.dyingSources = [];
    for (let [, {source}] of Object.entries(this.sources))
      source.forceValue(0);
  }
}

export default Sources