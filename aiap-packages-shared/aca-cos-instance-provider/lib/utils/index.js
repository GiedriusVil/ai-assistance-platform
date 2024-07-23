/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const getExpirationPrefix = () => {
  const EXP_3D_PREFIX = 'exp_3d';
  const EXP_5D_PREFIX = 'exp_5d';

  let retVal = EXP_3D_PREFIX;

  const CURRENT_WEEK_DAY = new Date().getDay();

  if (CURRENT_WEEK_DAY < 3 && CURRENT_WEEK_DAY >= 0 ) {
      retVal = EXP_3D_PREFIX;
  } else {
      retVal = EXP_5D_PREFIX;
  }
  return retVal;
};

module.exports = {
  getExpirationPrefix,
};
