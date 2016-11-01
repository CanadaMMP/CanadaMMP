import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import {StyleSheet, css} from 'aphrodite';
import _ from 'lodash';
import palette from '../constants/palette';
import Paper from 'material-ui/Paper';
import popout from '../../img/popout.svg';
import WhatIsDemocracy from './WhatIsDemocracy';
import WhatIsAWastedVote from './WhatIsAWastedVote';

import TableOfData from './tables/TableOfData';

import { headline, subheadline, definitions } from '../text/text_hero'

const styles = StyleSheet.create({
  heroStyle : {
    // height: '100px'
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
  },
  headlineStyle : {
    color: 'white',
    fontFamily: "Trocchi",
    fontSize: '4em',
    margin: '2vh 4vw',
    textAlign: 'center',
  },
});

class Hero extends Component {
  constructor(props){
    super(props);
  }

  render () {
    return (<div>
      <Paper className={css(styles.heroStyle)} zDepth={1} >
          <div className={css(styles.headlineStyle)}>
            {headline[this.props.language]}
          </div>
      </Paper>
      <WhatIsDemocracy />
      <WhatIsAWastedVote />
      </div>
    );
  }
}

export default reduxify(actions, ['language'], Hero);
