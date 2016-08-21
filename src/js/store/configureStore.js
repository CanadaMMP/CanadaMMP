// ==========================
// ./store/configureStore.js
// ==========================

import { createStore, applyMiddleware, compose } from 'redux';
import multi from 'redux-multi';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducers/index';
import createLogger from 'redux-logger';
// import { localLog, logToLocal, detectCrashes } from '../utilities/loggers'
import { HYDRATE } from '../constants/index'

let logger = createLogger({
  duration: true,
  timestamp: true,
  collapsed: true,
});

let enhancer;
if (process.env.NODE_ENV === 'testing'){
 // needed for testing.
  enhancer = compose(
    applyMiddleware(
      thunkMiddleware, // allows you to dispatch functions as actions.
      multi, // allows you to dispatch multiple actions from one action creator
      // logToLocal, // similar to logger but logs to local memory and can be accessed by application.
      // detectCrashes, // intercepts the "store.failure.hasFailure" bit and runs the program to autolog if true.
    ),
  );
} else {
  enhancer = compose(
    applyMiddleware(
      thunkMiddleware, // allows you to dispatch functions as actions.
      multi, // allows you to dispatch multiple actions from one action creator
      logger, // visual displays for the console.log (remove/commentout in production)
      // logToLocal, // similar to logger but logs to local memory and can be accessed by application.
      // detectCrashes, // intercepts the "store.failure.hasFailure" bit and runs the program to autolog if true.
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f // for chrome Redux Dev Tools.
  );
}

function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

const store = configureStore();

var backup = {};

// we MUST make sure we've got a confirmed backup store before we continue on.
function backupStore(){
  backup = store.getState();
}

function restoreStore(){
  store.dispatch({type: HYDRATE, payload: backup});
}

export {
  store as default,
  backupStore,
  restoreStore,
}
