import PropTypes from 'prop-types';
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  add(other, scalar = 1) {
    return point(this.x + scalar * other.x, this.y + scalar * other.y);
  }

  sub(other, scalar = 1) {
    return point(this.x - scalar * other.x, this.y - scalar * other.y);
  }

  mul(scalar, secondscalar) {
    if (secondscalar === undefined) {
      secondscalar = scalar;
    }
    return point(this.x * scalar, this.y * secondscalar);
  }

  div(scalar, secondscalar) {
    if (secondscalar === undefined) {
      secondscalar = scalar;
    }
    return point(this.x / scalar, this.y / secondscalar);
  }

  max(other) {
    return point(Math.max(this.x, other.x), Math.max(this.y, other.y));
  }

  min(other) {
    return point(Math.min(this.x, other.x), Math.min(this.y, other.y));
  }

  scale(scalar, relative = point(0, 0)) {
    return this.sub(relative).mul(scalar).add(relative);
  }
  affine(scalar, other) {
    return this.mul(1 - scalar).add(other, scalar);
  }

  norm(relative = point(0, 0)) {
    const diff = this.sub(relative);
    return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  }

  normal(relative = point(0, 0), scale=1.0) {
    const diff = this.sub(relative);
    const norm = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    return this.scale(scale/norm, relative);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
  cross(other) {
    return this.x * other.y - this.y * other.x;
  }
  round() {
    return point(Math.round(this.x), Math.round(this.y));
  }
  floor() {
    return point(Math.floor(this.x), Math.floor(this.y));
  }
  ceil() {
    return point(Math.ceil(this.x), Math.ceil(this.y));
  }
  random() {
    return point(Math.random()*this.x, Math.random()*this.y);
  }

  inConcave(cycle) {
    let angle = 0;
    let lastvect = this.sub(cycle[cycle.length-1]);
    for (let nextp of cycle) {
      let nextvect = this.sub(nextp);
      angle += Math.atan2(nextvect.cross(lastvect), nextvect.dot(lastvect));
      lastvect = nextvect;
    }
    return Math.abs(angle) > Math.PI;
  }

  inConvex(cycle) {
    console.log(cycle);
    console.log(this);
    if (cycle.length < 3) return false;
    let pathvect = cycle[0].sub(cycle[cycle.length-1]);
    let thisvect = cycle[0].sub(this);
    let sign = pathvect.cross(thisvect) > 0;
    for (let i = 0; i < cycle.length-1; i++) {
      pathvect = cycle[i+1].sub(cycle[i]);
      thisvect = cycle[i+1].sub(this);
      if (sign !== (pathvect.cross(thisvect) > 0))
        return false;
    }
    return true;
  }

  rot(angle, origin = point(0, 0)) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const p = this.sub(origin);
    const r = point(p.x*cos - p.y*sin, p.x*sin + p.y*cos);
    return r.add(origin);
  }

  toString() {
    return "x: " + this.x + ", y: " + this.y;
  }

  moveTo(context) {
    context.moveTo(this.x, this.y);
  }
  lineTo(context) {
    context.lineTo(this.x, this.y);
  }
  circle(context, radius) {
    context.beginPath();
    context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
  }
}

function point(x, y) {
  return new Point(x, y);
}
point.NEG_INFTY = point(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
point.POS_INFTY = point(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
let pointType = PropTypes.instanceOf(Point);

export {
  point,
  pointType
};