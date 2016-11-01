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
import HeroBarChart from '../charts/HeroBarChart';

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
    margin: '2vh 4vw'
  },
  flexContainer : {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    marginBottom: '5vh',
    textAlign: 'center',
  },
  leftContainer : {
    width: '50vw',
    order: "1",
    color: "white",
    fontFamily: "Patua One",
    textAlign: 'left',
  },
  rightContainer : {
    width: '50vw',
    order: "2",
  },
  popoutStyle : {
    maxWidth: "100%",
    maxHeight: "90vh",
  },
  paragraph: {
    marginBottom: "1vh",
  },
  chart: {
    position: 'absolute',
    width: '50vw',
    height: '50vh',
    margin: '0px 30px 0px 30px',
  },
  chartContainer: {
    padding: '0px 30px 0px 30px',
  }
});

class Hero extends Component {
  constructor(props){
    super(props);
  }

  render () {
    return (<div>
      <Paper className={css(styles.heroStyle)} zDepth={1} >
        <div className={css(styles.flexContainer)}>
          <div className={css(styles.headlineStyle)}>
            {headline[this.props.language]}
          </div>
          <div className={css(styles.chartContainer)}>
          </div>
        </div>
      </Paper>
      <WhatIsDemocracy />
      <HeroBarChart />
      </div>
    );
  }
}

export default reduxify(actions, ['language'], Hero);
