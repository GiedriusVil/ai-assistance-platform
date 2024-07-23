/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const _deepDifference = require('deep-diff');

const deepDifference = (lSide, rSide) => {
  const RET_VAL = _deepDifference(lSide, rSide);
  return RET_VAL;
}

module.exports = {
  deepDifference,
}
