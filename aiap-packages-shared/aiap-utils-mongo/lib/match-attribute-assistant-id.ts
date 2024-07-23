/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

const _matchAttributeAssistantIdByIds = (
  ids: Array<any>,
) => {
  const RET_VAL = {};
  if (
    lodash.isArray(ids) &&
    !lodash.isEmpty(ids)
  ) {
    RET_VAL['assistantId'] = {
      $in: ids
    };
  }
  return RET_VAL;
}

const matchAttributeAssistantIdByContext = (
  context: IContextV1,
) => {
  const SESSION_TENANT_ID = context?.user?.session?.tenant?.id;
  const SESSION_ACCESS_GROUP_TENANTS = context?.user?.session?.accessGroup?.tenants;

  const SESSION_ASSISTANT_IDS = [];
  if (
    lodash.isArray(SESSION_ACCESS_GROUP_TENANTS) &&
    !lodash.isEmpty(SESSION_ACCESS_GROUP_TENANTS)
  ) {
    const SESSION_ACCESS_GROUP_TENANT = SESSION_ACCESS_GROUP_TENANTS.find(item => SESSION_TENANT_ID === item.id);

    const SESSION_TENANT_ASSISTANS = ramda.pathOr([], ['assistants'], SESSION_ACCESS_GROUP_TENANT);
    if (
      lodash.isArray(SESSION_TENANT_ASSISTANS)
    ) {
      for (const ASSISTANT of SESSION_TENANT_ASSISTANS) {
        if (
          !lodash.isEmpty(ASSISTANT) &&
          !lodash.isEmpty(ASSISTANT.id)
        ) {
          SESSION_ASSISTANT_IDS.push(ASSISTANT.id);
        }
      }
    }
  }
  const RET_VAL = _matchAttributeAssistantIdByIds(SESSION_ASSISTANT_IDS);
  return RET_VAL;
};

const matchAttributeAssistantIdByParams = (
  params: {
    assistantIds: Array<any>,
    query: {
      filter: {
        assistantIds: Array<any>,
      }
    }
  }
) => {
  let assistantIds = params?.assistantIds;
  if (
    lodash.isEmpty(assistantIds)
  ) {
    assistantIds = params?.query?.filter?.assistantIds;
  }
  const RET_VAL = _matchAttributeAssistantIdByIds(assistantIds);
  return RET_VAL;
};

const matchAttributeAssistantId = (
  params: {
    assistantIds: Array<any>,
    query: {
      filter: {
        assistantIds: Array<any>,
      }
    }
  },
) => {
  let assistantIds = params?.assistantIds;
  if (
    lodash.isEmpty(assistantIds)
  ) {
    assistantIds = params?.query?.filter?.assistantIds;
  }
  const RET_VAL = _matchAttributeAssistantIdByIds(assistantIds);
  return RET_VAL;
};

export {
  matchAttributeAssistantId,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
}
