/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-retrieve-pull-options';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiServiceV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  tenantsService,
} from '@ibm-aiap/aiap-app-service';

import {
  findManyByQuery,
} from './find-many-by-query';


const _retrieveTenants = async (
  context: IContextV1,
) => {
  const CONTEXT_SESSION_TENANTS = context?.user?.session?.accessGroup?.tenants;
  const PROMISES = [];
  if (
    !lodash.isEmpty(CONTEXT_SESSION_TENANTS) &&
    lodash.isArray(CONTEXT_SESSION_TENANTS)
  ) {
    for (const CONTEXT_SESSION_TENANT of CONTEXT_SESSION_TENANTS) {
      if (
        !lodash.isEmpty(CONTEXT_SESSION_TENANT?.id)
      ) {
        PROMISES.push(tenantsService.findOneById(context, { id: CONTEXT_SESSION_TENANT?.id }))
      }
    }
  }
  const RET_VAL = await Promise.all(PROMISES);
  return RET_VAL;
}

const _sanitizedTenant = (
  tenant: ITenantV1,
) => {
  const RET_VAL = lodash.cloneDeep(tenant);
  delete RET_VAL.datasources;
  delete RET_VAL._datasources;
  return RET_VAL;
}

const _sanitizeAiService = (
  aiService: IAiServiceV1,
) => {
  const RET_VAL = lodash.cloneDeep(aiService);
  delete RET_VAL.external;
  delete RET_VAL.type;
  return RET_VAL;
}

const _retrieveAiServicesByAssistant = async (
  context: IContextV1,
  tenant: ITenantV1,
  params: {
    assistant: {
      id: any
    },
  }
) => {
  const PARAMS = {
    query: {
      filter: {
        assistantId: params?.assistant?.id,
      },
      sort: {
        field: '_id',
        direction: 'ASC',
      },
      pagination: {
        page: 1,
        size: 1000
      }
    }
  }
  const CONTEXT = lodash.cloneDeep(context);
  CONTEXT.user.session.tenant = tenant;

  const RESPONSE = await findManyByQuery(CONTEXT, PARAMS);

  const RET_VAL = [];
  if (
    !lodash.isEmpty(RESPONSE?.items) &&
    lodash.isArray(RESPONSE?.items)
  ) {
    for (const AI_SERVICE of RESPONSE.items) {
      if (
        !lodash.isEmpty(AI_SERVICE)
      ) {
        RET_VAL.push({
          tenant: _sanitizedTenant(tenant),
          assistant: params?.assistant,
          aiService: _sanitizeAiService(AI_SERVICE),
        });
      }
    }
  }
  return RET_VAL;
}

const _retrievePullOptions = async (
  context: IContextV1,
  tenants: Array<ITenantV1>,
  params
) => {
  const PROMISES = [];
  if (
    !lodash.isEmpty(tenants) &&
    lodash.isArray(tenants)
  ) {
    for (const TENANT of tenants) {
      if (
        !lodash.isEmpty(TENANT)
      ) {
        PROMISES.push(_retrieveAiServicesByAssistant(context, TENANT, params));
      }
    }
  }
  const PROMISES_VALS = await Promise.all(PROMISES);
  const RET_VAL = [];
  for (const VALUE of PROMISES_VALS) {
    RET_VAL.push(...VALUE);
  }
  return RET_VAL;
}

export const retrievePullOptions = async (
  context: IContextV1,
  params: {
    assistant: {
      id: any,
    }
  }
) => {
  try {
    const TENANTS = await _retrieveTenants(context);
    const RET_VAL = await _retrievePullOptions(context, TENANTS, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrievePullOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
