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
const matchAttributeSkill = (
  params: {
    selectedSkills: Array<any>,
  },
) => {
  const RET_VAL = {};
  const SELECTED_SKILLS = params?.selectedSkills;
  if (
    lodash.isArray(SELECTED_SKILLS) &&
    !lodash.isEmpty(SELECTED_SKILLS)
  ) {
    RET_VAL['skillId'] = {
      $in: SELECTED_SKILLS
    };
  }
  return RET_VAL;
};

export {
  matchAttributeSkill,
}
