/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-authorize-user-assign-tenants-to-tenantlesss-applications';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextApplicationV1,
  IContextTenantV1,
  IContextUserSessionAccessGroupViewV1,
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneById,
} from '../find-one-by-id';
import { IContextAssistantV1 } from '@ibm-aiap/aiap--types-server/dist/lib/context-assistant';

export const mergeSessionAccessGroupTenants = async (
  user: IContextUserV1,
  options?: any,
) => {
  try {
    const CONTEXT = {
      user,
    }

    const PARAMS = {
      id: user?.id,
    }

    const EXISTING_USER = await findOneById(CONTEXT, PARAMS);

    const SESSION = user?.session;

    SESSION.tenants = EXISTING_USER?.tenants || [];

    const SESSION_ACCESS_GROUP = SESSION?.accessGroup;
    if (
      !lodash.isEmpty(SESSION_ACCESS_GROUP)
    ) {
      const MERGED_TENANTS: Array<IContextTenantV1> = [];

      SESSION_ACCESS_GROUP?.tenants
        ?.forEach((tenant: IContextTenantV1) => {
          if (
            lodash.isEmpty(tenant.id) ||
            lodash.isEmpty(tenant.name)
          ) {
            EXISTING_USER.tenants
              ?.forEach((userTenant: ITenantV1) => {

                const EXISTING_UPDATED_TENANT = MERGED_TENANTS?.find((el: IContextTenantV1) => lodash.isEqual(el?.id, userTenant?.id));

                if (
                  !lodash.isEmpty(EXISTING_UPDATED_TENANT)
                ) {
                  const INDEX = lodash.indexOf(MERGED_TENANTS, EXISTING_UPDATED_TENANT);
                  MERGED_TENANTS[INDEX] = _mergeTenant(EXISTING_UPDATED_TENANT, tenant);

                } else {
                  const UPDATED_TENANT = lodash.cloneDeep(tenant);
                  UPDATED_TENANT.id = userTenant?.id;
                  UPDATED_TENANT.name = userTenant?.name;
                  UPDATED_TENANT.environment = {
                    id: '',
                  };
                  MERGED_TENANTS.push(UPDATED_TENANT);
                }
              });

          } else {
            const EXISTING_UPDATED_TENANT = MERGED_TENANTS?.find(el => lodash.isEqual(el?.id, tenant?.id));

            if (
              !lodash.isEmpty(EXISTING_UPDATED_TENANT)
            ) {
              const INDEX = lodash.indexOf(MERGED_TENANTS, EXISTING_UPDATED_TENANT);

              MERGED_TENANTS[INDEX] = _mergeTenant(EXISTING_UPDATED_TENANT, tenant);

            } else {
              MERGED_TENANTS.push(tenant);

            }
          }
        });

      if (
        !lodash.isEmpty(MERGED_TENANTS)
      ) {
        SESSION_ACCESS_GROUP.tenants = MERGED_TENANTS;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(mergeSessionAccessGroupTenants.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _mergeTenant = (
  sourceTenant: IContextTenantV1,
  comparisonTenant: IContextTenantV1,
) => {
  const MERGED_TENANT: IContextTenantV1 = lodash.cloneDeep(sourceTenant);
  if (
    !lodash.isEmpty(MERGED_TENANT) &&
    !lodash.isEmpty(comparisonTenant)
  ) {
    _mergeApplications(MERGED_TENANT.applications, comparisonTenant.applications);
    MERGED_TENANT.environment = lodash.merge(MERGED_TENANT.environment, comparisonTenant.environment);
  }
  return MERGED_TENANT;
}

const _mergeApplications = (
  sourceApps: Array<IContextApplicationV1>,
  comparisonApps: Array<IContextApplicationV1>,
) => {
  if (
    lodash.isArray(sourceApps) &&
    lodash.isArray(comparisonApps)
  ) {
    comparisonApps.forEach(comparisonApp => {
      const EXISTING_APP = sourceApps?.find(sourceApp => lodash.isEqual(sourceApp.id, comparisonApp.id));
      if (
        !lodash.isEmpty(EXISTING_APP)
      ) {
        const INDEX = lodash.indexOf(sourceApps, EXISTING_APP);
        sourceApps[INDEX] = _mergeApplication(EXISTING_APP, comparisonApp);
      } else {
        sourceApps?.push(comparisonApp);
      }
    });

  }
}

const _mergeApplication = (
  sourceApp: IContextApplicationV1,
  comparisonApp: IContextApplicationV1,
) => {
  const MERGED_APP: IContextApplicationV1 = lodash.cloneDeep(sourceApp);
  if (
    !lodash.isEmpty(MERGED_APP) &&
    !lodash.isEmpty(comparisonApp)
  ) {
    _mergeViews(MERGED_APP.views, comparisonApp.views);
    _mergeAssistants(MERGED_APP.assistants, comparisonApp.assistants);
  }
  return MERGED_APP;
}

const _mergeViews = (
  sourceViews: Array<IContextUserSessionAccessGroupViewV1>,
  comparisonViews: Array<IContextUserSessionAccessGroupViewV1>,
) => {
  if (
    lodash.isArray(sourceViews) &&
    lodash.isArray(comparisonViews)
  ) {
    comparisonViews.forEach((comparisonView: IContextUserSessionAccessGroupViewV1) => {
      const EXISTING_VIEW = sourceViews.find((sourceView: IContextUserSessionAccessGroupViewV1) => lodash.isEqual(sourceView.name, comparisonView.name));

      if (
        !lodash.isEmpty(EXISTING_VIEW)
      ) {
        const INDEX = lodash.indexOf(sourceViews, EXISTING_VIEW);
        sourceViews[INDEX] = lodash.merge(EXISTING_VIEW, comparisonView);

      } else {
        sourceViews.push(comparisonView);
      }
    });
  }
}

const _mergeAssistants = (
  sourceAssistants: Array<IContextAssistantV1>,
  comparisonAssistants: Array<IContextAssistantV1>,
) => {
  if (
    lodash.isArray(sourceAssistants) &&
    lodash.isArray(comparisonAssistants)
  ) {
    comparisonAssistants.forEach(additionalAssistant => {
      const EXISTING_ASSISTANT = sourceAssistants.find((sourceAssistant: IContextAssistantV1) => lodash.isEqual(sourceAssistant.name, additionalAssistant.name));

      if (
        !lodash.isEmpty(EXISTING_ASSISTANT)
      ) {
        const INDEX = lodash.indexOf(sourceAssistants, EXISTING_ASSISTANT);
        sourceAssistants[INDEX] = lodash.merge(EXISTING_ASSISTANT, additionalAssistant);

      } else {
        sourceAssistants.push(additionalAssistant);
      }
    });
  }
}
