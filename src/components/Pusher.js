import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Pusher extends Component {
  componentWillMount() {
    const params = this.props.history.location.pathname.slice(1);
    if (params.length === 0)
      return;

    console.log("params");
    console.log(params);
    const urlState = JSON.parse(params);
    console.log("urlState");
    console.log(urlState);
    this.props.setState(urlState);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.state === nextProps.state)
      return;
    console.log("next props");
    console.log(nextProps.state);
    this.props.history.push("/" + encodeURI(JSON.stringify(nextProps.state)));
  }
  render() {
    return null;
  }
}

Pusher.propTypes = {};
Pusher.defaultProps = {};

export default Pusher;
