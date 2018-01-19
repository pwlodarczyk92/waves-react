import {Component} from 'react';
import {initialState} from "../features/reducers";

class Pusher extends Component {
  componentWillMount() {
    const params = this.props.history.location.search.slice(3);
    if (params.length === 0)
      return;
    const urlState = JSON.parse(decodeURIComponent(params));
    this.props.setState({...initialState, ...urlState});
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


export default Pusher;
