import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import {StyleSheet, css} from 'aphrodite';
import palette from '../constants/palette';
import Paper from 'material-ui/Paper';
import popout from '../../img/popout.svg';
import canadaflag from '../../img/canadaflag.svg';
import Markdown from 'react-remarkable';

import {headline, headline2, subheadline, subheadline2, subheadline3, adams} from '../text/text_WhatIsDemocracy';

const styles = StyleSheet.create({
  main: {
    fontFamily: 'Catamaran',
    margin: '20px auto',
    padding: '20px',
  },
  headline: {
    fontSize: '3em',
  },
  mathLine: {
    textAlign: 'right',
  },
  subheadline: {
    fontSize: '1.5em',
  },
  canadaFlag: {
    margin: '20px',
    float: "left",
    width: '300px',
  },
  container: {
    maxWidth: '960px',
    margin:'auto',
  }
});



class WhatIsDemocracy extends Component {
  constructor(props){
    super(props);
  }

  render () {
    return (<Paper className={css(styles.main)} zDepth={5} >
    <div className={css(styles.container)}>
      <div className={css(styles.headline)}>{headline[this.props.language]}</div>
      <div className={css(styles.canadaFlag)}><img width={"300px"} src={canadaflag}/></div>
      <div className={css(styles.subheadline)}><Markdown>{subheadline[this.props.language]}</Markdown></div>
      <div className={css(styles.subheadline)}><Markdown>{subheadline2[this.props.language]}</Markdown></div>
      <div className={css(styles.subheadline)}><Markdown>{subheadline3[this.props.language]}</Markdown></div>

      <div className={css(styles.mathLine)}><Markdown>{headline2[this.props.language]}</Markdown></div>
    </div>
    {/*{adams[this.props.language].map((line) => <Markdown text={line}/>)}*/}
      </Paper>
    );
  }
}

export default reduxify(actions, ['language'], WhatIsDemocracy);