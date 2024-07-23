/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeBuyRuleId = (
  id: string,
) => {
  const RET_VAL: any = {};
  if (
    !lodash.isEmpty(id)
  ) {
    RET_VAL['ruleId'] = id;
  }
  return RET_VAL;
}

export {
  matchAttributeBuyRuleId,
}
