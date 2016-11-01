import tinycolor from 'tinycolor2';

let base = {
  white: '#FFFFFF',
  canadianFlagRed: '#FF0000',
  liberalRed: '#FF0000',
  conservativeBlue: '#0C499C',
  ndpOrange: '#f47216',
  blocBlue: '#00A7EC',
  greenPartyGreen: '#3D9B35',
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
