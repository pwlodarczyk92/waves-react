import { Component } from 'react';

class Clock extends Component {
  componentDidMount() {
    this.intervalId = setInterval(this.props.function, this.props.delay);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.delay !== nextProps.delay || this.props.function !== nextProps.function) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(nextProps.function, nextProps.delay);
    }
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
  render() {
    return null;
  }
}

export {Clock}