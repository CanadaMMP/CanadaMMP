import {
  SET_CHOICE,
  REMOVE_CANDIDATE,
  CLEAR_BALLOT,
  REPLACE_BALLOT,
  SET_NEW_VALUE,
} from '../constants/index';

export const addVotePreference = (candidate, position) => ({
  type: SET_CHOICE,
  candidate,
  position,
})
export const removeCandidate = (candidate) => ({
  type: REMOVE_CANDIDATE,
  candidate
})
export const clearBallot = () => ({ type: CLEAR_BALLOT })
export const replaceBallot = (ballot) => ({ type: REPLACE_BALLOT, ballot })
export const eliminateLoser = (loser) => removeCandidate(loser);
export const changeVoteValue = (value) => ({type: SET_NEW_VALUE, value})
export const processWinner = (winner, value) => [changeVoteValue(value), removeCandidate(winner)]
