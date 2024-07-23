/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

/**
 * 
 * @param params 
 * @returns 
 * @deprecated -> Use more generic matcher!
 */
const matchAttributeScore = (
  params: {
    score: any,
  },
) => {
  const RET_VAL = {};
  const SCORE = params?.score;

  if (
    lodash.isNumber(SCORE)
  ) {
    RET_VAL['score'] = SCORE;
  }
  return RET_VAL;
}

export {
  matchAttributeScore,
}
