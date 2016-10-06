import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {mainPieChartData} from '../constants/precalculatedData';
import palette from '../constants/palette';
import {StyleSheet, css} from 'aphrodite';

// alias for typing
const PCD = mainPieChartData;
import _ from 'lodash';
import Recharts, {PieChart, Pie, Sector, Cell, Legend} from 'recharts';


const inner = [
  {
    name: "Liberal",
    value: PCD.wasted["Liberal"] + PCD.notWasted["Liberal"]
  }, {
    name: "Conservative",
    value: PCD.notWasted["Conservative"] + PCD.wasted["Conservative"]
  }, {
    name: "NDP",
    value: PCD.notWasted["NDP-New Democratic Party"] + PCD.wasted["NDP-New Democratic Party"]
  }, {
    name: "Bloc",
    value: PCD.notWasted["Bloc Québécois"] + PCD.wasted["Bloc Québécois"]
  }, {
    name: "Greens",
    value: PCD.wasted["Green Party"] + PCD.notWasted["Green Party"]
  }, {
    name: "Others",
    value: PCD.wasted["Others"]
  }
].reverse();

const outer = [
  {
    name: "Liberal",
    value: PCD.notWasted["Liberal"]
  }, {
    name: "Wasted",
    value: PCD.wasted["Liberal"]
  }, {
    name: "Conservative",
    value: PCD.notWasted["Conservative"]
  }, {
    name: "Wasted",
    value: PCD.wasted["Conservative"]
  }, {
    name: "NDP",
    value: PCD.notWasted["NDP-New Democratic Party"]
  }, {
    name: "Wasted",
    value: PCD.wasted["NDP-New Democratic Party"]
  }, {
    name: "Bloc",
    value: PCD.notWasted["Bloc Québécois"]
  }, {
    name: "Wasted",
    value: PCD.wasted["Bloc Québécois"]
  }, {
    name: "Greens",
    value: PCD.notWasted["Green Party"]
  }, {
    name: "Wasted",
    value: PCD.wasted["Green Party"]
  }, {
    name: "Wasted",
    value: PCD.wasted["Others"]
  }
].reverse();
const styles = StyleSheet.create({
  chartLabel: {
    fontFamily: 'Lato',
  }
});

const RADIAN = Math.PI / 180;
const renderCustomizedInnerLabel = ({
  name,
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} className={css(styles.chartLabel)} fill="white" textAnchor={x > cx
      ? 'start'
      : 'end'} dominantBaseline="central">
      {`${ (percent * 100).toFixed(0)}%` + " " + name}
    </text>
  );
};
const renderCustomizedOuterLabel = ({
  name,
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text className={css(styles.chartLabel)} x={x} y={y} fill="white" textAnchor={x > cx
      ? 'start'
      : 'end'} dominantBaseline="central">
      {`${ (percent * 100).toFixed(0)}%`+ " " + name}
    </text>
  );
};

const COLORS = {
  "Liberal": '#ea6d6a',
  "Conservative": '#6495ed',
  "NDP": '#f4a460',
  "Bloc":'#87cefa',
  "Greens":'#99c955',
  "Wasted":'#888888',
  "Others":'#BBBBBB',
};
class HeroPieChart extends Component {
  constructor(props){

    super(props);
  }

  render() {
    return (
      <PieChart width={800} height={400}>
        <Pie data={outer} cx={200} cy={200} label={renderCustomizedOuterLabel} innerRadius={110} outerRadius={140} fill="#82ca9d" labelLine={true}>
        {
          outer.map((entry, index) => <Cell fill={COLORS[entry.name]}/>)
        }
        </Pie>
        <Pie data={inner} cx={200} cy={200} label={renderCustomizedInnerLabel} outerRadius={100} fill="#8884d8" labelLine={true}>
        {
          inner.map((entry, index) => <Cell fill={COLORS[entry.name]}/>)
        }
        </Pie>
       </PieChart>
    );
  }
}

export default HeroPieChart;
