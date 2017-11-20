import {point} from "../utils/point";

class Table {
  constructor(wrapper, table_ptr) {
    this.wrapper = wrapper;
    this._table_ptr = table_ptr;
  }

  normalize() {
    this.wrapper._normalize(this._table_ptr);
  }

  free() {
    this.wrapper._free_table(this._table_ptr);
  }
}

class Board {
  constructor(wrapper, board_ptr) {
    this.wrapper = wrapper;
    this._board_ptr = board_ptr;
    this.velocityTable = new Table(this.wrapper, this.wrapper._velocity_patch(board_ptr));
    this.deflectionTable = new Table(this.wrapper, this.wrapper._deflection_patch(board_ptr));
    this.increment = this.increment.bind(this);
  }

  set timestep(timestep) {
    this.wrapper._set_timestep(this._board_ptr, timestep);
  }

  get time() {
    this.wrapper._get_time(this._board_ptr);
  }

  increment() {
    this.wrapper._increment(this._board_ptr);
  }
}

class RegularBoard extends Board {
  constructor(wrapper, board_ptr) {
    super(wrapper, board_ptr);
  }

  set acceleration(acceleration) {
    this.wrapper._set_acceleration(this._board_ptr, acceleration);
  }

  set damping(damping) {
    this.wrapper._set_damping(this._board_ptr, damping);
  }
}

class Patch extends Table {
  constructor(wrapper, table_ptr, data_ptr) {
    super(wrapper, table_ptr, data_ptr);
    this.data_ptr = data_ptr;
  }

  /** @target {Table} table */
  applyPatch(target, point, amplitude) {
    this.wrapper._apply_patch(target._table_ptr, this._table_ptr, point.x, point.y, amplitude);
  }

  free() {
    super.free();
    this.wrapper.Module._free(this.data_ptr);
  }
}

class RadialPatch extends Patch {
  /** @point {Point} radius */
  constructor(wrapper, table_ptr, data_ptr, radius) {
    super(wrapper, table_ptr, data_ptr);
    this.radius = radius;
  }

  /** @target {Table} table */
  /** @point {Point} point */
  applyPatch(target, point, amplitude) {
    this.wrapper._apply_patch(target._table_ptr, this._table_ptr, point.x - this.radius, point.y - this.radius, amplitude);
  }
}

class Image {
  constructor(wrapper, size) {
    this.wrapper = wrapper;
    this.size = size;
    this._image_ptr = this.wrapper._make_image(size.x, size.y);
  }

  /** @target {Table} table */
  draw(table) {
    this.wrapper._draw_table(table._table_ptr, this._image_ptr);
  }

  toContext(context) {
    const imageArray = new Uint8ClampedArray(this.wrapper.Module.HEAPU8.buffer, this._image_ptr, this.size.x * this.size.y * 4);
    const imageData = new ImageData(imageArray, this.size.x, this.size.y);
    context.putImageData(imageData, 0, 0);
  }
}

export class Wrapper {
  constructor(Module) {
    this.Module = Module;

    this._velocity_patch = this.Module.cwrap('velocity_table', 'number', ['number']);
    this._deflection_patch = this.Module.cwrap('deflection_table', 'number', ['number']);
    this._set_timestep = this.Module.cwrap('set_timestep', null, ['number', 'number']);
    this._get_time = this.Module.cwrap('get_time', 'number', ['number']);
    this._increment = this.Module.cwrap('increment', null, ['number']);

    this._make_regular_board = this.Module.cwrap('make_regular_board', 'number', ['number', 'number', 'number', 'number', 'number']);
    this._set_acceleration = this.Module.cwrap('set_acceleration', null, ['number', 'number']);
    this._set_damping = this.Module.cwrap('set_damping', null, ['number', 'number']);

    this._make_image = this.Module.cwrap('make_image', 'number', ['number', 'number']); //xsize, ysize
    this._draw_table = this.Module.cwrap('draw_table', null, ['number', 'number']);

    this._normalize = this.Module.cwrap('normalize', null, ['number']);
    this._make_table = this.Module.cwrap('make_table', 'number', ['number', 'number', 'number']); //xsize, ysize, *values
    this._free_table = this.Module.cwrap('free_table', null, ['number']);
    this._apply_patch = this.Module.cwrap('apply_patch', null, ['number', 'number', 'number', 'number', 'number']);


    this.makeRegularBoard = this.makeRegularBoard.bind(this);
    this.makeImage = this.makeImage.bind(this);
    this.allocateFloats = this.allocateFloats.bind(this);
    this.makePatch = this.makePatch.bind(this);
    this.makeRadialPatch = this.makeRadialPatch.bind(this);
  }

  makeRegularBoard(size, timestep, acceleration, damping) {
    const board_ptr = this._make_regular_board(size.x, size.y, timestep, acceleration, damping);
    return new RegularBoard(this, board_ptr);
  };

  makeImage(size) {
    return new Image(this, size);
  };

  makePatch(xsize, ysize, data_ptr) {
    const table_ptr = this._make_table(xsize, ysize, data_ptr);
    return new Patch(this, table_ptr, data_ptr);
  };

  static makeRadialArray(radius, fun) {
    const size = radius * 2 + 1;
    const view = new Float32Array(size * size);
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const dp = point(dx, dy);
        const p = dp.add(point(radius, radius));
        if (dp.norm() <= radius) {
          view[size * p.y + p.x] = fun(dp, radius);
        }
        else
          view[size * p.y + p.x] = 0;
      }
    }
    return view;
  }

  allocateFloats(view) {
    const bytes = view.length * view.BYTES_PER_ELEMENT;
    const ptr = this.Module._malloc(bytes);
    const heap = new Float32Array(this.Module.HEAPU32.buffer, ptr, view.length);
    heap.set(view);
    return ptr;
  };

  makeRadialPatch(radius, fun) {
    const view = Wrapper.makeRadialArray(radius, fun);
    const ptr = this.allocateFloats(view);
    const table_ptr = this._make_table(radius * 2 + 1, radius * 2 + 1, ptr);
    return new RadialPatch(this, table_ptr, ptr, radius);
  }
}

  
  
  

