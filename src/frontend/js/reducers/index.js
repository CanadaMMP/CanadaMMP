// ==========================
// ./reducers/index.js
// ==========================

import { combineReducers } from 'redux';
import * as ballot from './ballot';

const appReducer = combineReducers(Object.assign({}, ballot));

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
