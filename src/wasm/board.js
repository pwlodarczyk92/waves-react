const protoBoard = {
  setTimestep(timestep) {
    this.wrapper._set_timestep(this.board_ptr, timestep);
  },
  getTime() {
    this.wrapper._get_time(this.board_ptr);
  },
  increment() {
    this.wrapper._increment(this.board_ptr);
  }
};

const protoRegularBoard = {
  setAcceleration(acceleration) {
    this.wrapper._set_acceleration(this._board_ptr, acceleration);
  },
  setDamping(damping) {
    this.wrapper._set_damping(this._board_ptr, damping);
  }
};

const protoPatch = {
  apply(target, point, amplitude) {
    this.wrapper._apply(target, this.table_ptr, point.x, point.y, amplitude);
  }
};

function Board(wrapper, board_ptr) {
  this.wrapper = wrapper;
  this.board_ptr = board_ptr;
  this.velocity_ptr = this.wrapper._velocity_patch(board_ptr);
  this.deflection_ptr = this.wrapper._deflection_patch(board_ptr);
}

function RegularBoard(wrapper, board_ptr) {
  Board(wrapper, board_ptr);
}

function Image(image_ptr) {
  this.image_ptr = image_ptr;
  this.image_array = new Uint8ClampedArray(this.Module.HEAPU8.buffer, this.image_ptr, this.size.x * this.size.y * 4);
}

function Patch(xsize, ysize, data) {
  this.data = data;
  this.table_ptr = this.wrapper._make_table(xsize, ysize, data);
}

Object.assign(Board.prototype, protoBoard);
Object.assign(RegularBoard.prototype, protoRegularBoard);
Object.assign(Patch.prototype, protoPatch);

function wrapModule(Module) {

  this.Module = Module;

  this._velocity_patch = this.Module.cwrap('velocity_table', 'number', ['number']);
  this._deflection_patch = this.Module.cwrap('deflection_table', 'number', ['number']);
  this._set_timestep = this.Module.cwrap('set_timestep', null, ['number', 'number']);
  this._get_time = this.Module.cwrap('get_time', 'number', ['number']);
  this._increment = this.Module.cwrap('increment', null, ['number']);

  this._make_regular_board = this.Module.cwrap('make_regular_board', 'number', ['number', 'number', 'number', 'number', 'number']);
  this._set_acceleration = this.Module.cwrap('set_acceleration', null, ['number', 'number']);
  this._set_damping = this.Module.cwrap('set_damping', null, ['number', 'number']);
  this.makeRegularBoard = function (xsize, ysize, acceleration, damping, timestep) {
    const board_ptr = this._make_regular_board(xsize, ysize, acceleration, damping, timestep);
    return new RegularBoard(this, board_ptr);
  };

  this._make_image = this.Module.cwrap('make_image', 'number', ['number', 'number']); //xsize, ysize
  this.makeImage = function (xsize, ysize) {
    return new Image(this._make_image(xsize, ysize));
  };

  this._make_table = this.Module.cwrap('make_table', 'number', ['number', 'number', 'number']); //xsize, ysize, *values
  this._apply = this.Module.cwrap('apply_patch', null, ['number', 'number', 'number', 'number', 'number']);
  this.makePatch = function (xsize, ysize, data) {
    return new Patch(xsize, ysize, data);
  };

  this._draw_board = this.Module.cwrap('draw_board', null, ['number', 'number']);
  this.drawBoard = function(board, image) {
    this._draw_board(board.board_ptr, image.image_ptr);
  };

  this._board_ptr = this.make_board(this.size.x, this.size.y, this.acceleration, this.damping, this.timestep);
  this._velocity_ptr = this.velocity_patch(this.board_ptr);
  this._deflection_ptr = this.deflection_patch(this.board_ptr);

  this._image_ptr = this.make_image(this.size.x, this.size.y);
  this._move_ptr = this.radialPatch(this.mouseRadius);
  this._press_ptr = this.radialPatch(this.pressRadius);


  this.regular_board = function (xsize, ysize, acceleration, damping, timestep) {
  }
}
  
  
  

