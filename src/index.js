import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './frontend/js/store/configureStore';
import App from './frontend/js/containers/App';

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

ReactDOM.render(<Root store={store} />, MOUNT_NODE)
