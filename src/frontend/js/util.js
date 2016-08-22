import _ from 'lodash';
/** function bindAllMethods()
 * This takes and ES6 class with methods, and automatically binds "this" - ie.,
 * the class itself, to the methods. This should not be used if even one 
 * method needs a different context for "this", but otherwise, it's a timesaver.
 * @param {class} SomeClass - an ES6 class which contains methods
 * @sideeffect - someClass will have "this" bound to all methods
 */
export const bindAllMethods = (someClass) => {
  for(let key of Object.keys(someClass)){
    if (_.isFunction(someClass[key])){
      someClass[key] = someClass[key].bind(someClass);
    }
  }
}
