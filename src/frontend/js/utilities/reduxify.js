// ==========================
// ./utilities/reduxify.js
// desc: Development tools to automatically bind actions and storestate to props.
// ==========================

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

export default function reduxify(actions, reducerList, component){

  let mapStateToProps = (state) => _.pick(state, reducerList)

  let prepareActions = (actions) => (dispatch) =>
    ({ actions: bindActionCreators(actions.default, dispatch),
       dispatch: dispatch,
     })

  let mapDispatchToProps = (dispatch) => (prepareActions(actions, dispatch))

  return connect(mapStateToProps, mapDispatchToProps)(component);

}
