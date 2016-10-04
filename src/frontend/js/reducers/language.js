import {
  SET_LANGUAGE,
  ENGLISH,
  FRANCAIS,
} from '../constants/index';

export function language(state = 'English', action = {}) {
  switch(action.type){
  case SET_LANGUAGE:
    return action.language;
  default: return state;
  }
}
