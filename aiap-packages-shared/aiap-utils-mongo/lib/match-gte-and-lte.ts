/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchGteAndLte = (
  attribute,
  { from, to }
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(attribute) &&
    !lodash.isNil(from) &&
    lodash.isNumber(from) &&
    !lodash.isNil(to) &&
    lodash.isNumber(to)) {
    RET_VAL[attribute] = {
      $gte: from,
      $lte: to,
    };
  }
  return RET_VAL;
};

export {
  matchGteAndLte,
}
