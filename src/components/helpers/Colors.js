import {RGB} from "../../utils/color";

class Colors {
  constructor(wrapper, colors) {
    this.update = this.update.bind(this);
    this.get = this.get.bind(this);
    this.free = this.free.bind(this);

    this.wrapper = wrapper;
    this.colors = null;
    this.palette = null;

    this.update(colors);
  }

  get() {
    if (this.palette === undefined || this.palette === null)
      throw new Error("palette not defined");
    return this.palette;
  }

  update(colors) {
    if (this.colors === null ||
      RGB.equals(colors.lowColor, this.colors.lowColor) ||
      RGB.equals(colors.zeroColor, this.colors.zeroColor) ||
      RGB.equals(colors.highColor, this.colors.highColor)) {
      const newPalette = this.wrapper.makePalette(Colors.colorsList(colors));
      const oldPalette = this.palette;
      this.colors = colors;
      this.palette = newPalette;
      if (oldPalette !== null && oldPalette !== undefined)
        oldPalette.free();
    }
  }

  free() {
    const palette = this.palette;
    this.colors = null;
    this.palette = null;
    if (palette !== null && palette !== undefined)
      palette.free();
  }

  static colorsList(colors) {
    const colorList = [colors.lowColor, colors.zeroColor, colors.highColor];
    const result = [];
    const len = 256;
    for (let curr = 0; curr < colorList.length - 1; curr++) {
      const lastCol = RGB.build(colorList[curr]);
      const nextCol = RGB.build(colorList[curr+1]);
      for (let i = 0; i <= len; i++)
        result.push(lastCol.mix(i / len, nextCol));
    }
    return result;
  }
}

export default Colors;
