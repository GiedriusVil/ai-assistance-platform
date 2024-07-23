/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

/**
 * 
 * @param id 
 * @returns 
 * @deprecated -> Use more generic matcher!
 */
const matchAttributeRuleId = (
  id: string,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(id)
  ) {
    RET_VAL['ruleId'] = id;
  }
  return RET_VAL;
};

export {
  matchAttributeRuleId,
}
