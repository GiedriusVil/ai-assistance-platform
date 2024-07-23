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
const matchAttributeDocExtId = (
  params: {
    docExtId: string,
  },
) => {
  const RET_VAL = {};
  const DOC_EXT_ID = params?.docExtId;
  if (
    !lodash.isEmpty(DOC_EXT_ID)
  ) {
    RET_VAL['docExtId'] = DOC_EXT_ID;
  }
  return RET_VAL;
};

export {
  matchAttributeDocExtId,
}
