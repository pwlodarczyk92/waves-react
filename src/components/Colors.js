import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {RGB} from "../../utils/color";
import {App} from "../Board";

class Colors extends Component {
  constructor(props) {
    super(props);
    this.replace = this.replace.bind(this);
  }
  componentDidMount() {
    const colorsList = App.colorsList([this.props.lowColor, this.props.zeroColor, this.props.highColor]);
    this.replace(this.props.wrapper.makePalette(colorsList));
  }
  componentWillReceiveProps(nextProps) {
    if (!RGB.equals(nextProps.lowColor, this.props.lowColor) ||
      !RGB.equals(nextProps.zeroColor, this.props.zeroColor) ||
      !RGB.equals(nextProps.highColor, this.props.highColor)) {
      const colorsList = App.colorsList([nextProps.lowColor, nextProps.zeroColor, nextProps.highColor]);
      this.replace(this.props.wrapper.makePalette(colorsList));
    }
  }
  componentWillUnmount(){
    this.replace(null);
  }

  replace(newPalette) {
    const oldPalette = this.props.container.palette;
    this.props.container.palette = newPalette;
    if (oldPalette !== null && oldPalette !== undefined)
      oldPalette.free();
  }
  static colorsList(colors) {
    const result = [];
    const len = 256;
    for (let curr = 0; curr < colors.length - 1; curr++) {
      const lastCol = RGB.build(colors[curr]);
      const nextCol = RGB.build(colors[curr+1]);
      for (let i = 0; i <= len; i++)
        result.push(lastCol.mix(i / len, nextCol));
    }
    return result;
  }
  render() {
    return null;
  }
}

Colors.propTypes = {
  container: PropTypes.objectOf(),
  wrapper: PropTypes.objectOf()
};
Colors.defaultProps = {};

export default Colors;
