/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

/**
 * 
 * @param params 
 * @returns 
 * @deprecated -> Use more generic matcher! Also params have strange structure!
 */
const matchAttributeOrganizationId = (
  params: {
    organization: any,
  },
) => {
  const ORG_ID = params?.organization;
  const RET_VAL = {};
  if (
    !lodash.isEmpty(ORG_ID)
  ) {
    RET_VAL['context.user.session.organization.id'] = ORG_ID;
  }
  return RET_VAL;
};

export {
  matchAttributeOrganizationId,
}
