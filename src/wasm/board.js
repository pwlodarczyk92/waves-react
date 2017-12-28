import {point} from "../utils/point";

class Table {
  constructor(wrapper, table_ptr) {
    this.normalize = this.normalize.bind(this);
    this.affine = this.affine.bind(this);
    this.free = this.free.bind(this);
    this.wrapper = wrapper;
    this._table_ptr = table_ptr;
  }

  normalize() {
    this.wrapper._normalize(this._table_ptr);
  }

  affine(point, a, b) {
    this.wrapper._affine(this._table_ptr, point.x, point.y, a, b);
  }

  free() {
    this.wrapper._free_table(this._table_ptr);
    this.wrapper = undefined;
    this._table_ptr = undefined;
  }
}

class Board {
  constructor(wrapper, board_ptr, size) {
    this.increment = this.increment.bind(this);
    this.wrapper = wrapper;
    this._board_ptr = board_ptr;
    this.size = size;
    this.velocityTable = new Table(this.wrapper, this.wrapper._velocity_patch(board_ptr));
    this.deflectionTable = new Table(this.wrapper, this.wrapper._deflection_patch(board_ptr));
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
    this.applyPatch = this.applyPatch.bind(this);
    this.free = this.free.bind(this);
    this._data_ptr = data_ptr;
  }

  /** @target {Table} table */
  applyPatch(target, point, amplitude) {
    this.wrapper._apply_patch(target._table_ptr, this._table_ptr, point.x, point.y, amplitude);
  }

  free() {
    this.wrapper.Module._free(this._data_ptr);
    this._data_ptr = undefined;
    super.free();
  }
}

class RadialPatch extends Patch {
  /** @point {Point} radius */
  constructor(wrapper, table_ptr, data_ptr, radius) {
    super(wrapper, table_ptr, data_ptr);
    this.applyPatch = this.applyPatch.bind(this);
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

  free() {
    this.wrapper._free_image(this._image_ptr);
    this.wrapper = undefined;
    this.size = undefined;
    this._image_ptr = undefined;
  }
}

class Palette {
  constructor(wrapper, data_ptr, palette_ptr, size) {
    this.wrapper = wrapper;
    this._data_ptr = data_ptr;
    this._palette_ptr = palette_ptr;
    this.size = size;
  }

  free() {
    this.wrapper._free_palette(this._palette_ptr);
    this.wrapper.Module._free(this._data_ptr);
    this.wrapper = undefined;
    this._data_ptr = undefined;
    this._palette_ptr = undefined;
    this.size = undefined;
  }

  draw(table, image) {
    this.wrapper._draw_with_palette(table._table_ptr, image._image_ptr, this._palette_ptr);
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
    this._affine = this.Module.cwrap('affine', null, ['number', 'number', 'number', 'number']); //table, x, y, a, b
    this._make_table = this.Module.cwrap('make_table', 'number', ['number', 'number', 'number']); //xsize, ysize, *values
    this._free_table = this.Module.cwrap('free_table', null, ['number']);
    this._free_image = this.Module.cwrap('free_image', null, ['number']);
    this._apply_patch = this.Module.cwrap('apply_patch', null, ['number', 'number', 'number', 'number', 'number']);

    this._make_palette = this.Module.cwrap('make_palette', 'number', ['number', 'number']);
    this._free_palette = this.Module.cwrap('free_palette', null, ['number']);
    this._draw_with_palette = this.Module.cwrap('draw_with_palette', null, ['number', 'number', 'number']);

    this.makeRegularBoard = this.makeRegularBoard.bind(this);
    this.makeImage = this.makeImage.bind(this);
    this.allocateFloats = this.allocateFloats.bind(this);
    this.makePatch = this.makePatch.bind(this);
    this.makeRadialPatch = this.makeRadialPatch.bind(this);
  }

  makeRegularBoard(size, timestep, acceleration, damping) {
    const board_ptr = this._make_regular_board(size.x, size.y, timestep, acceleration, damping);
    return new RegularBoard(this, board_ptr, size);
  };

  makeImage(size) {
    return new Image(this, size);
  };

  makePatch(xsize, ysize, data_ptr) {
    const table_ptr = this._make_table(xsize, ysize, data_ptr);
    return new Patch(this, table_ptr, data_ptr);
  };

  makeRadialPatch(radius, fun) {
    const view = Wrapper.makeRadialArray(radius, fun);
    const ptr = this.allocateFloats(view);
    const table_ptr = this._make_table(radius * 2 + 1, radius * 2 + 1, ptr);
    return new RadialPatch(this, table_ptr, ptr, radius);
  }

  makePalette(colors) {
    const data_ptr = this.allocateColors(colors);
    const palette_ptr = this._make_palette(colors.length, data_ptr);
    return new Palette(this, data_ptr, palette_ptr, colors.length);
  }

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

  allocateColors(colors) {
    const ptr = this.Module._malloc(colors.length * 4);
    const array = new Uint8ClampedArray(this.Module.HEAPU8.buffer, ptr, colors.length * 4);
    for (let i = 0; i < colors.length; i++) {
      array[i*4] = colors[i].r;
      array[i*4+1] = colors[i].g;
      array[i*4+2] = colors[i].b;
      array[i*4+3] = 255;
    }
    return ptr;
  }

}

  
  
  

