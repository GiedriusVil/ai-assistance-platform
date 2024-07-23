/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-controllers-access-groups-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  accessGroupsService,
  tenantsService,
} from '@ibm-aiap/aiap-app-service';

const _assignTenantEnvironment = async (
  context: IContextV1,
  tenant: ITenantV1,
) => {
  if (
    tenant &&
    tenant.id
  ) {
    const PARAMS = {
      id: tenant.id
    };
    const ORIGINAL_TENANT = await tenantsService.findOneById(context, PARAMS);

    let environmentId;
    if (
      ORIGINAL_TENANT.environment
    ) {
      environmentId = ORIGINAL_TENANT.environment.id;
    } else {
      environmentId = 'unknown';
      logger.info('Not found tenant environmentId ->', { PARAMS });
    }

    tenant.environmentId = environmentId;
  }
}

export const findOneById = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const ID = request?.params?.id;
    if (lodash.isEmpty(ERRORS)) {
      const PARAMS = {
        id: ID
      };
      const ACCESS_GROUP = await accessGroupsService.findOneById(CONTEXT, PARAMS);
      if (
        ACCESS_GROUP &&
        ACCESS_GROUP.tenants
      ) {
        const PROMISES = [];
        for (const TENANT of ACCESS_GROUP.tenants) {
          if (
            !lodash.isEmpty(TENANT)
          ) {
            PROMISES.push(_assignTenantEnvironment(CONTEXT, TENANT));
          }
        }

        await Promise.all(PROMISES);
      }

      retVal = ACCESS_GROUP;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(findOneById.name, { ERRORS });
    response.status(500).json(ERRORS);
  }
}
