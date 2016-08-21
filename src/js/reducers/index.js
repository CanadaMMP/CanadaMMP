// ==========================
// ./reducers/index.js
// ==========================

import { combineReducers } from 'redux';
import * as counter from './counter'

const appReducer = combineReducers(Object.assign({}, counter));

const rootReducer = (state, action) => {
  // if (action.type === CLEAR_TO_DEFAULT) {
  //   // DANGER!  DANGER!  DANGER!
  //   return appReducer(undefined, action);
  //   // THIS CLEARS STATE TO DEFAULT.
  // } else {
    return appReducer(state, action);
  // }
};

export default rootReducer;
