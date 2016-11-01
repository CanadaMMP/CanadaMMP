import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {StyleSheet, css} from 'aphrodite';
import {wastageDataArray, TOTAL_POPULAR_VOTE, TOTAL_NON_WASTED} from '../constants/precalculatedData';
import palette from '../constants/palette';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const HeroBarChart = (props) =>
  (<Table
    selectable={false}>
   <TableHeader displaySelectAll={false}>
     <TableRow>
       <TableHeaderColumn>Party Name</TableHeaderColumn>
       <TableHeaderColumn>Total Votes Cast</TableHeaderColumn>
       <TableHeaderColumn>% of Popular Vote</TableHeaderColumn>
       <TableHeaderColumn>Wasted Votes</TableHeaderColumn>
       <TableHeaderColumn>% of Votes Wasted</TableHeaderColumn>
       <TableHeaderColumn>Seats in Parliament</TableHeaderColumn>
       <TableHeaderColumn>% Seats</TableHeaderColumn>
       <TableHeaderColumn>% of NON-WASTED Votes</TableHeaderColumn>



     </TableRow>
   </TableHeader>
   <TableBody displayRowCheckbox={false}>
     {wastageDataArray.map((entry) => (
       <TableRow>
         <TableRowColumn>{entry.party}</TableRowColumn>
         <TableRowColumn>{entry.wasted + entry.notWasted}</TableRowColumn>
         <TableRowColumn>{((100/TOTAL_POPULAR_VOTE) * (entry.wasted + entry.notWasted)).toFixed(2)}</TableRowColumn>

         <TableRowColumn>{entry.wasted}</TableRowColumn>
         <TableRowColumn>{(100 * entry.wasted / (entry.wasted + entry.notWasted)).toFixed(2)}%</TableRowColumn>
         <TableRowColumn>{entry.seats}</TableRowColumn>
         <TableRowColumn>{(100 * entry.seats/338).toFixed(2)}</TableRowColumn>
         <TableRowColumn>{(100*entry.notWasted/TOTAL_NON_WASTED).toFixed(2)}</TableRowColumn>

       </TableRow>
     ))}
   </TableBody>
 </Table>)



export default HeroBarChart;
