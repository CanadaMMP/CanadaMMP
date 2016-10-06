import tinycolor from 'tinycolor2';

let base = {
  white: '#FFFFFF',
  canadianFlagRed: '#FF0000',
  liberalRed: '#ea6d6a',
  conservativeBlue: '#6495ed',
  ndpOrange: '#f4a460',
  blocBlue: '#87cefa',
  greenPartyGreen: '#99c955',
};
let waste = {
  conservativeWaste: tinycolor(base.conservativeBlue).lighten(20).desaturate(80).toString(),
  ndpWaste: tinycolor(base.ndpOrange).lighten(20).desaturate(80).toString(),
  blocWaste: tinycolor(base.blocBlue).lighten(20).desaturate(80).toString(),
  greenWaste: tinycolor(base.greenPartyGreen).lighten(20).desaturate(80).toString(),
  otherWaste: tinycolor("#FFFFFF").lighten(20).desaturate(80).toString(),
  liberalWaste: tinycolor(base.liberalRed).lighten(20).desaturate(80).toString(),
};


export default Object.assign(base, waste);
