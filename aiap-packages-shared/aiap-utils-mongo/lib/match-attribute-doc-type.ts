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
const matchAttributeDocType = (
  params: {
    docType: string,
  },
) => {
  const RET_VAL = {};
  const DOC_TYPE = params?.docType;
  if (
    !lodash.isEmpty(DOC_TYPE)
  ) {
    RET_VAL['docType'] = DOC_TYPE;
  }
  return RET_VAL;
};

export {
  matchAttributeDocType,
}
