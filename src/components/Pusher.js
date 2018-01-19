import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Pusher extends Component {
  componentWillMount() {
    const params = this.props.history.location.search.slice(3);
    if (params.length === 0)
      return;
    const urlState = JSON.parse(decodeURIComponent(params));
    this.props.setState(urlState);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.state === nextProps.state)
      return;
    this.props.history.push("/?s=" + JSON.stringify(nextProps.state));
  }
  render() {
    return null;
  }
}

Pusher.propTypes = {};
Pusher.defaultProps = {};

export default Pusher;
