/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchRuleType = (
  params: {
    ruleType: any,
  }
) => {
  const RET_VAL = {};
  const RULE_TYPE = params?.ruleType;

  if (
    !lodash.isEmpty(RULE_TYPE)
  ) {
    RET_VAL['ruleType'] = RULE_TYPE;
  }
  return RET_VAL;
};

export {
  matchRuleType,
}
