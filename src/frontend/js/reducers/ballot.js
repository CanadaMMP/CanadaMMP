import {
  SET_CHOICE,
  REMOVE_CANDIDATE,
  CLEAR_BALLOT,
  REPLACE_BALLOT,
  SET_NEW_VALUE,
} from '../constants/index';

/**
 * votePreferences - stores the vote preferences of the voter.
 * @param  {array} state = [] - vote state;
 * @param  {object} action - Redux action which contains the data.
 *   @property {string} type - type of redux action
 *   @property {string} candidate - candidate to modify
 *   @property {array<object>} - a preconfigured ballot
 *   @property {number} position - position to modify (array index);
 * @return {array} - vote state;
 */
export function votePreferences(state = [], action = {}) {
  switch(action.type){
    case SET_CHOICE:
      // because position can be "0";
      if (action.position === undefined && state.includes(action.candidate)){
        return state;
      }
      if (action.position === undefined){
        return state.concat(action.candidate)
      }
      let filteredState = state.filter((pref) => (pref !== action.candidate))
      return filteredState.slice(0, action.position)
        .concat(action.candidate).concat(filteredState.slice(action.position))

      return state.slice(0, action.position).concat(action.candidate).concat(state.slice(action.position + 1))
    case REMOVE_CANDIDATE:
      return state.filter((pref) => (pref !== action.candidate))
    case CLEAR_BALLOT:
      return [];
    case REPLACE_BALLOT:
      return action.ballot;
    default: return state;
  }
}

export function voteValue(state = 1, action = {}){
  switch(action.type){
    case SET_NEW_VALUE:
      return state * action.value;
    default: return state;
  }
}
