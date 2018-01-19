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
    const diff = {};
    for (const [key, val] of Object.entries(nextProps.state))
      if (initialState[key] !== val)
        diff[key] = val;
    this.props.history.push("/?s=" + JSON.stringify(diff));
  }
  render() {
    return null;
  }
}


export default Pusher;
