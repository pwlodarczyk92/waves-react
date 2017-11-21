class RGB {
	static fromText(arg) {
    const probe = document.createElement('div');
    probe.style.color = arg;
    document.body.appendChild(probe);
    const style = window.getComputedStyle(probe);
    const colors = style.color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
    document.body.removeChild(probe);
    return new RGB(colors[0], colors[1], colors[2]);
  }
  static build(obj) {
	  return new RGB(obj.r, obj.g, obj.b);
  }
  static equals(a, b) {
	  return a.r === b.r && a.g === b.g && a.b === b.b;
  }
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.hex = this.hex.bind(this);
  }
  hex() {
    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
  }
  mix(fraction, other) {
		const revfrac = 1-fraction;
    return new RGB(
    	this.r * revfrac + other.r * fraction,
      this.g * revfrac + other.g * fraction,
      this.b * revfrac + other.b * fraction
		);
  }

}

export {RGB}