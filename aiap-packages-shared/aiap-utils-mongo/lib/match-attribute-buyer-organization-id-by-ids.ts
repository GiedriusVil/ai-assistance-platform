/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeBuyerOrganizationIdByIds = (
  params: {
    organizationIds: Array<string>,
  }
) => {
  const IDS = params?.organizationIds;
  const RET_VAL = {};
  if (
    lodash.isArray(IDS) &&
    !lodash.isEmpty(IDS)
  ) {
    RET_VAL['context.user.session.organization.id'] = {
      $in: IDS,
    };
  }
  return RET_VAL;
}

export {
  matchAttributeBuyerOrganizationIdByIds,
}
