import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {mainPieChartData} from '../constants/precalculatedData';
import palette from '../constants/palette';
// alias for typing
const PCD = mainPieChartData;
import _ from 'lodash';
import Recharts, {PieChart, Pie, Sector, Cell, Legend} from 'recharts';


// order is important so this needs to be hardcoded.
let chartData = [
  ["Party", "Votes"],
  ["Liberal", PCD.notWasted["Liberal"]],
  ["Conservative", PCD.notWasted["Conservative"]],
  ["NDP", PCD.notWasted["NDP-New Democratic Party"]],
  ["Bloc", PCD.notWasted["Bloc Québécois"]],
  ["Greens", PCD.notWasted["Green Party"]],
  ["Liberal (wasted)", PCD.wasted["Liberal"]],
  ["Conservative (wasted)", PCD.wasted["Conservative"]],
  ["NDP (wasted)", PCD.wasted["NDP-New Democratic Party"]],
  ["Bloc (wasted)", PCD.wasted["Bloc Québécois"]],
  ["Greens (wasted)", ],
  ["Others (wasted)", PCD.wasted["Others"]],
];

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
]

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
    name: "Greens",
    value: PCD.wasted["Green Party"]
  }, {
    name: "Wasted",
    value: PCD.wasted["Others"]
  }
]


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
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx
      ? 'start'
      : 'end'} dominantBaseline="central">
      {`${ (percent * 100).toFixed(0)}%` + name}
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
    <text x={x} y={y} fill="white" textAnchor={x > cx
      ? 'start'
      : 'end'} dominantBaseline="central">
      {`${ (percent * 100).toFixed(0)}%` + name}
    </text>
  );
};

class HeroPieChart extends Component {
  constructor(props){

    super(props);
  }

  render() {
    return (
      <PieChart width={800} height={400}>
        <Pie data={outer} cx={200} cy={200} label={renderCustomizedOuterLabel} innerRadius={110} outerRadius={140} fill="#82ca9d" labelLine={true}>
        {/* {
          data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
        } */}
        <Pie/>
        <Pie data={inner} cx={200} cy={200} label={renderCustomizedInnerLabel} outerRadius={100} fill="#8884d8" labelLine={true}/>
       </PieChart>
    );
  }
}

export default HeroPieChart;
