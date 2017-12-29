class Effect {
    constructor(wrapper, radius) {
    this.update = this.update.bind(this);
    this.get = this.get.bind(this);
    this.free = this.free.bind(this);

    this.radius = null;
    this.patch = null;
    this.wrapper = wrapper;

    this.update(radius);
  }

  get() {
    if (this.patch === null || this.patch === undefined)
      throw new Error("patch not defined");
    return this.patch;
  }

  update(radius) {
    if (this.patch === null ||
      this.radius !== radius) {
      const oldPatch = this.patch;
      const newPatch = this.wrapper.makeRadialPatch(radius, Effect.radfun);
      this.radius = radius;
      this.patch = newPatch;
      if (oldPatch !== null && oldPatch !== undefined)
        oldPatch.free();
    }
  }

  free() {
    const patch = this.patch;
    this.radius = null;
    this.patch = null;
    if (patch !== null && patch !== undefined)
      patch.free();
  }

  static radfun(dp, radius) {
    return 0.5*(Math.cos(Math.PI * dp.norm() / radius) + 1);
  }

}

export default Effect;
