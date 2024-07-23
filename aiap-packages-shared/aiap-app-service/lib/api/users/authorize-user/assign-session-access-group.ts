/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-authorize-user-assign-session-access-group';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IContextUserV1,
  IContextUserSessionAccessGroupV1,
  IContextTenantV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAccessGroupV1,
  IAccessGroupV1View,
  IAccessGroupV1ViewAction,
  IApplicationV1,
  IAssistantV1,
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import * as _accessGroupsUtils from '../../../utils/access-groups-utils';
import * as _accessGroupsService from '../../access-groups';
import * as _tenantsService from '../../tenants';

const _sanitizeAction = (
  action: IAccessGroupV1ViewAction,
) => {
  if (
    action
  ) {
    delete action.name;
  }
}

const _sanitizeView = (
  view: IAccessGroupV1View,
) => {
  if (
    view
  ) {
    delete view?.content;
    delete view?.selected;
    delete view?.name;
  }
  const ACTIONS = view?.actions;
  if (
    ACTIONS
  ) {
    for (const ACTION of ACTIONS) {
      _sanitizeAction(ACTION);
    }
  }
}

const _sanitizeAssistant = (
  assistant: IAssistantV1,
) => {
  const VIEWS = assistant?.views;
  if (
    VIEWS
  ) {
    for (const VIEW of VIEWS) {
      _sanitizeView(VIEW);
    }
  }
}

const _sanitizeApplication = (
  application: IApplicationV1,
) => {
  const VIEWS = application?.views;
  const ASSISTANTS = application?.assistants;
  if (
    VIEWS
  ) {
    for (const VIEW of VIEWS) {
      _sanitizeView(VIEW);
    }
  }
  if (
    ASSISTANTS
  ) {
    for (const ASSISTANT of ASSISTANTS) {
      _sanitizeAssistant(ASSISTANT);
    }
  }
}

const _sanitizeTenant = (
  tenant: ITenantV1,
) => {
  const APPLICATIONS = tenant?.applications;
  for (const APPLICATION of APPLICATIONS) {
    _sanitizeApplication(APPLICATION);
  }
}

const _sanitizeAccessGroup = (
  accessGroup: IAccessGroupV1,
) => {
  const VIEWS = accessGroup?.views;
  const TENANTS = accessGroup?.tenants;
  if (
    VIEWS
  ) {
    for (const VIEW of VIEWS) {
      _sanitizeView(VIEW);
    }
  }
  if (
    TENANTS
  ) {
    for (const TENANT of TENANTS) {
      _sanitizeTenant(TENANT);
    }
  }
}

const _sanitizeAccessGroups = (
  accessGroups: Array<IAccessGroupV1>
) => {
  if (
    !lodash.isEmpty(accessGroups) &&
    lodash.isArray(accessGroups)
  ) {
    accessGroups.map((accessGroup) => {
      _sanitizeAccessGroup(accessGroup);
    });
  }
}

const _uploadTenantData = async (
  context: IContextV1,
  tenant: IContextTenantV1,
) => {
  if (
    context &&
    tenant?.id
  ) {
    const PARAMS = {
      id: tenant?.id
    }
    const ORIGINAL_TENANT = await _tenantsService.findOneById(context, PARAMS);
    tenant.environment = ORIGINAL_TENANT.environment;
  }
}

const _uploadTenantsData = async (
  context: IContextV1,
  accessGroup: IContextUserSessionAccessGroupV1,
) => {
  const TENANTS = accessGroup?.tenants;

  const PROMISES = [];
  if (
    TENANTS
  ) {
    for (const TENANT of TENANTS) {
      PROMISES.push(
        _uploadTenantData(context, TENANT)
      );
    }
  }
  await Promise.all(PROMISES);
}

export const assignSesionAccessGroup = async (
  user: IContextUserV1,
) => {
  try {
    const CONTEXT = {
      user: user
    }
    user.session = {};
    const USER_ACCESS_GROUP_IDS = user?.accessGroupIds;
    if (
      !lodash.isEmpty(USER_ACCESS_GROUP_IDS)
    ) {
      const ACCESS_GROUP_QUERY = {
        query: {
          filter: {
            ids: USER_ACCESS_GROUP_IDS,
          },
          sort: {
            field: 'id',
            direction: 'asc'
          },
          pagination: {
            page: 0,
            size: 1000
          },
        },
      };
      const RESPONSE = await _accessGroupsService.findManyByQuery(CONTEXT, ACCESS_GROUP_QUERY);
      const ACCESS_GROUPS = RESPONSE?.items;
      _sanitizeAccessGroups(ACCESS_GROUPS);

      const ACCESS_GROUP = _accessGroupsUtils.mergeAccessGroups2SessionAccessGroup(ACCESS_GROUPS);
      await _uploadTenantsData(CONTEXT, ACCESS_GROUP);
      user.session.accessGroup = ACCESS_GROUP
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(assignSesionAccessGroup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
