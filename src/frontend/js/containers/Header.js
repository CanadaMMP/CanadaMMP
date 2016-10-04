// import {bindAllMethods} from './util';
import reduxify from '../utilities/reduxify';
import * as actions from '../actions/index';
import React, {Component} from 'react';
import _ from 'lodash';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import HamburgerIcon from 'material-ui/svg-icons/navigation/menu';
import LanguageIcon from 'material-ui/svg-icons/action/language';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import palette from '../constants/palette';
class Header extends Component {
  constructor(props){
    super(props);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.languageDivProps = _.pick(props, ['language']);
  }

  handleLanguageChange (event, value) {
    this.props.actions.setLanguage(value);
  }

  render () {
    return (
      <AppBar
        title="CanadaMMP"
        style={{backgroundColor: palette.canadianFlagRed}}
        iconElementLeft={
          <IconMenu
            iconButtonElement={
              <IconButton><HamburgerIcon color="white"/></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        }
        iconElementRight={
          <IconMenu
            onChange={this.handleLanguageChange}
            iconButtonElement={<div style={{display:'flex', alignItems: 'center', color: palette.white}}>{this.props.language}<IconButton><LanguageIcon color="white"/></IconButton></div>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              primaryText="English"
              value="English"
            />
            <MenuItem
              primaryText="Français"
              value="Français"
            />
          </IconMenu>
        }
      />
    );
  }
}

export default reduxify(actions, ['language'], Header);
