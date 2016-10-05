import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import _ from 'lodash';
import palette from '../constants/palette';
import Paper from 'material-ui/Paper';
import popout from '../../img/popout.svg';

const headline = {
  English: "Here's what you need to know about MMP and proportional representation",
  Français: "Ce que vous devez savoir sur MMP et la représentation proportionnelle"
};

const subheadline = {
  English: [
    "In a short time, Canada will be asked to choose whether or not they will adopt a new, more proportional, representation system. It's a new way of voting and thinking about representation.",
    "We think that the choice to go with MMP is the smart one for Canada, and in this interactive demo, we hope to explain why MMP will allow voters to have more say in their government, and better hold politicians accountable.",
    "Mixed Member Proportional is simply a fairer, better system for electing representatives to Parliament.",
    "Please allow us this chance to explain how."
  ],
  Français: [
    "Dans un court laps de temps, le Canada sera demandé de choisir si oui ou non ils vont adopter un nouveau système de représentation, plus proportionnel. Il est une nouvelle façon de voter et la réflexion sur la représentation.",
    "Nous pensons que le choix d'aller avec MMP est une puce pour le Canada, et dans cette démo interactive, nous espérons expliquer pourquoi MMP permettra aux électeurs d'avoir plus disent dans leur gouvernement, et de meilleurs politiciens de tenir responsables.",
    "Proportionnelle mixte est tout simplement un, meilleur système plus juste pour l'élection des représentants au Parlement.",
    "S'il vous plaît nous permettre cette chance d'expliquer comment"
  ],
};

const definitions = {
  English: {
    headerMMP: "Mixed Member Proportional (MMP)",
    textMMP: "A hybrid two-tier voting system, where the proportion of votes each party gets is equal to the proportion of seats they get in Parliament",
    headerFPP: "First Past the Post (FPP)",
    textFPP: "Canada's current voting system, where each riding holds an election, and a plurality (not necessarily a majority) of voters select one representative with all the power for that district. It is also called \"Winner Take All\" voting."
  },
  Français: {
    headerMMP: "Représentation proportionnelle mixte (RPM ou MMP)",
    textMMP: "Un système de vote à deux vitesses hybride, où la proportion de votes chaque parti obtient est égale à la proportion de sièges qu'ils obtiennent au Parlement",
    headerFPP: "Uninominal Majoritare (UM ou FPP)",
    textFpp: "Courant de vote système canadien, où chaque circonscription est titulaire d'une élection, et une pluralité (pas nécessairement la majorité) des électeurs choisissent un représentant de toute la puissance de ce district. Il est aussi appelé \"Le gagnant remporte tout\" vote."
  }
};

const heroStyle = {
  // height: '100px',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
  backgroundColor: 'rgba(0,0,0,0.7)',
};

const headlineStyle = {
  color: 'white',
  fontFamily: "Patua One",
  fontSize: '3em',
  margin: '2vh 4vw'
};

const flexContainer = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "stretch",
  marginBottom: '5vh',
};
const leftContainer = {
  order: "1",
  color: "white",
  fontFamily: "Patua One",
  minWidth: "25%",
};
const rightContainer = {
  order: "2",
  flex: "flex-grow",
  textAlign: 'left',
  maxWidth: '800px',
};
const subContainerStyle={
  fontFamily: "Lato",
  margin: '2vh 4vw',
  padding:'1vh 1vw',
  fontSize: '1.1em',
  backgroundColor: 'rgba(255,255, 255,0.7)',
}
const popoutStyle = {
  maxWidth: "100%",
  maxHeight: "90vh",
}
import { Textfit } from 'react-textfit';

class Hero extends Component {
  constructor(props){
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    let thing = findDOMNode(this.refs.leftContainer)
    console.log(thing);
    console.log(thing.offsetWidth);
  }

  render () {
    return (<div >
      <Paper style={heroStyle} zDepth={1} >
        <div style={flexContainer}>
        <div ref="leftContainer" style={leftContainer}>
        <img style={popoutStyle} src={popout} />
        </div>
        <div style={rightContainer}>
          <div style={headlineStyle}>
            {headline[this.props.language]}
          </div>
          <Paper style={subContainerStyle} zDepth={3}>
            {subheadline[this.props.language].map((line) => (<div style={{marginBottom: '1vh'}}>{line}</div>))}
          </Paper>
        </div>
        </div>
      </Paper>
      </div>
    );
  }
}

export default reduxify(actions, ['language'], Hero);
