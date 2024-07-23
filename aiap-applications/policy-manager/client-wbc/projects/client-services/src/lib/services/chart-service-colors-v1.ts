/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { blue, cyan, green, magenta, orange, purple, red, teal, yellow } from '@carbon/colors';
import * as R from 'ramda';

export namespace CarbonPalettes {
  // https://www.carbondesignsystem.com/data-visualization/color-palettes#categorical-palettes
  const categoricalPalettes = {
    1: [purple[70]],
    2: [purple[70], teal[50]],
    3: [purple[50], teal[70], magenta[70]],
    4: [magenta[70], red[50], red[90], purple[50]],
    5: [purple[70], cyan[50], teal[70], magenta[70], red[90]],
    default: [
      purple[70],
      cyan[50],
      teal[70],
      magenta[70],
      red[50],
      red[90],
      green[60],
      blue[80],
      magenta[50],
      yellow[50],
      teal[50],
      cyan[90],
      orange[70],
      purple[50],
    ],
  };
  export const categorical = (count: number): any => {
    const colors = count in categoricalPalettes ? categoricalPalettes[count] : categoricalPalettes['default'];
    return R.slice(0, count, colors);
  };
}
