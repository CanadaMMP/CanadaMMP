import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import {StyleSheet, css} from 'aphrodite';
import palette from '../constants/palette';
import Paper from 'material-ui/Paper';
import popout from '../../img/popout.svg';
import Markdown from 'react-remarkable';

import {headline, subheadline, subheadline2, adams} from '../text/text_WhatIsDemocracy';

const styles = StyleSheet.create({
  main: {
    fontFamily: 'Catamaran',
    margin: '20px auto',
    padding: '20px',
  },
  headline: {
    fontSize: '3em',
  },
  subheadline: {
    fontSize: '1.5em',
  }
});



class WhatIsDemocracy extends Component {
  constructor(props){
    super(props);
  }

  render () {
    return (<Paper className={css(styles.main)} zDepth={5} >
    <div className={css(styles.headline)}>{headline[this.props.language]}</div>
    <div className={css(styles.subheadline)}><Markdown>{subheadline[this.props.language]}</Markdown></div>
    <div className={css(styles.subheadline)}><Markdown>{subheadline2[this.props.language]}</Markdown></div>

    {/*{adams[this.props.language].map((line) => <Markdown text={line}/>)}*/}
      </Paper>
    );
  }
}

export default reduxify(actions, ['language'], WhatIsDemocracy);
