const wastageDataArray = [
  { party: "Liberal", notWasted: 2827851, wasted: 4115086, seats: 184 },
  { party: "Conservative", notWasted: 1572203, wasted: 4041430, seats: 99  },
  { party: "NDP-New Democratic Party", notWasted: 690462, wasted: 2778906, seats: 44 },
  { party: "Bloc Québécois", notWasted: 157133, wasted: 664011, seats:10 },
  { party: "Green Party", notWasted: 13261, wasted: 589672, seats: 1 },
  { party: "Others", notWasted: 0, wasted: 141453, seats: 0 },
];

let wastageDataObj = {
  "wasted": {
    "Others": 141453,
    "Liberal": 4115086,
    "NDP-New Democratic Party": 2778906,
    "Conservative": 4041430,
    "Green Party": 589672,
    "Bloc Québécois": 664011
  },
  "notWasted": {
    "Liberal": 2827851,
    "NDP-New Democratic Party": 690462,
    "Conservative": 1572203,
    "Bloc Québécois": 157133,
    "Green Party": 13261
  }
};

const TOTAL_POPULAR_VOTE = 17591468;
const TOTAL_NON_WASTED = _.reduce(wastageDataObj.notWasted, (pv, value, key) => pv + value, 0);

export {
  wastageDataArray,
  wastageDataObj,
  TOTAL_POPULAR_VOTE,
  TOTAL_NON_WASTED,
};
