import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './containers/App';

const MOUNT_NODE = document.getElementById('root');

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

injectTapEventPlugin()
ReactDOM.render(<Root store={store} />, MOUNT_NODE)
