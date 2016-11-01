import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {StyleSheet, css} from 'aphrodite';
import {wastageDataArray, TOTAL_POPULAR_VOTE, TOTAL_NON_WASTED} from '../../constants/precalculatedData';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import palette from '../../constants/palette';

const partyInfo = {
  Liberal: {
    short: "LIB",
    bg: palette.liberalRed,
    text: '#FFFFFF',
  },
  Conservative: {
    short: "CONS",
    bg: palette.conservativeBlue,
    text: '#FFFFFF',
  },
  "NDP-New Democratic Party": {
    short: "NDP",
    bg: palette.ndpOrange,
    text: "#FFFFFF"
  },
  "Bloc Québécois": {
    short: "BLOC",
    bg: palette.blocBlue,
    text: "#FFFFFF",
  },
  "Green Party": {
    short: "GREEN",
    bg: palette.greenPartyGreen,
    text: "#FFFFFF",
  },
  "Others": {
    short: "OTHERS",
    bg: "#888888",
    text: "#FFFFFF",
  }
};

const PopularVotesSeats = (props) =>
  (<table>
  <tr>
    <th></th>
    {wastageDataArray.map((entry) => (<th style={{backgroundColor: partyInfo[entry.party].bg, color: 'white'}}>{partyInfo[entry.party].short}</th>))}
  </tr>
  <tr>
    <td>Total Votes:</td>
    {wastageDataArray.map((entry) => (<td style={{backgroundColor: partyInfo[entry.party].bg, color: 'white'}}>{(entry.notWasted + entry.wasted).toLocaleString()}</td>))}

  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>)



export default PopularVotesSeats;
