/**
 * candidateName() returns a string based on an object that has a first, middle, and family name.
 * @param      {object} candidate  - the candidate's name as an object
 *   @property {string} familyName - the candidate's family name;
 *   @property {string} firstName  - the candidate's first name;
 *   @property {string} middleName - the candidate's middle name. Can be an empty string.
 * @return     {string}            - a stringified version of the candidate's name, e.g. "TRUDEAU, Justin".
 */
export default (candidate) => "" + candidate.familyName.toUpperCase() + ", " + candidate.firstName + (candidate.middleName ? (" " + candidate.middleName) : "");
