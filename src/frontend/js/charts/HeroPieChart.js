import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Chart} from 'react-google-charts';

let metaProps = {
  "chartTitle": "DonutChart",
  "chartType": "PieChart",
  "width": "100%",
  "data": [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
  ],
  "options": {
    // "title" "",
    "pieHole": 0.4,
    "is3D": false,
    "colors": ["#8844A0", "#004488"],
    backgroundColor: { fill:'transparent' }
  }
};
console.log("chart!", Chart)

class HeroPieChart extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
    <div className={"my-pretty-chart-container"}>
      <Chart {...metaProps} width={"100%"} height={"400px"}  legend_toggle={true} />
    </div>
    );
  }
}

export default HeroPieChart;
