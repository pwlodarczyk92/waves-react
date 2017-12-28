class Sources {
  constructor(effect) {
    this.sources = {};
    this.effect = effect;
  }
  increment(timestep) {
    const deadSources = [];
    for (let [key, source] of Object.entries(this.sources)) {
      let [value, phase] = source.integrateValue(timestep);
      this.effect(source.position, value, phase);
      if (!source.isAlive())
        deadSources.push(key);
    }
    for (let key of deadSources) {
      delete this.sources[key];
      this.announceRemoval(key);
    }
  }
  removeSource(key) {
    if (this.sources[key])
      delete this.sources[key];
  }
}

export default Sources