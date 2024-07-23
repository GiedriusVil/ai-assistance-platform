/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextApplicationV1,
  IContextTenantV1,
  IContextUserSessionAccessGroupV1,
  IContextUserSessionAccessGroupViewV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAccessGroupV1,
  IAccessGroupV1View,
  IAccessGroupV1ViewAction,
  IApplicationV1,
  IAssistantV1,
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';
import { IContextAssistantV1 } from '@ibm-aiap/aiap--types-server/dist/lib/context-assistant';

const _mergeView = (
  targetView: IContextUserSessionAccessGroupViewV1,
  view: IAccessGroupV1View,
) => {
  const ACTIONS = view?.actions;
  if (
    !targetView.actions
  ) {
    targetView.actions = [];
  }

  for (const ACTION of ACTIONS) {
    const TARGET_ACTION = targetView.actions
      .find((item: IAccessGroupV1ViewAction) => {
        let retVal = false;
        const ACTION_COMPONENT = ACTION?.component;
        const ITEM_COMPONENT = item?.component;
        if (
          ACTION_COMPONENT &&
          ITEM_COMPONENT &&
          ACTION_COMPONENT === ITEM_COMPONENT
        ) {
          retVal = true;
        }
        return retVal;
      });

    if (
      !TARGET_ACTION
    ) {
      targetView.actions.push(ACTION);
    }
  }
}


const _mergeAccessGroupViewsIntoTarget = (
  target: {
    views?: Array<IContextUserSessionAccessGroupViewV1>,
  },
  views: Array<IAccessGroupV1View>,
) => {
  if (
    !target.views
  ) {
    target.views = [];
  }
  if (
    !lodash.isEmpty(views) &&
    lodash.isArray(views)
  ) {
    for (const VIEW of views) {
      const TARGET_VIEW = target.views
        .find((item: IAccessGroupV1View) => {
          let retVal = false;
          const ITEM_COMPONENT = item?.component;
          const VIEW_COMPONENT = VIEW?.component;
          if (
            ITEM_COMPONENT &&
            VIEW_COMPONENT &&
            ITEM_COMPONENT === VIEW_COMPONENT
          ) {
            retVal = true;
          }
          return retVal;
        });

      if (
        TARGET_VIEW
      ) {
        _mergeView(TARGET_VIEW, VIEW);
      } else {
        target.views.push(VIEW);
      }
    }
  }
}

const _mergeAssistant = (
  target: IContextAssistantV1,
  assistant: IAssistantV1,
) => {
  const VIEWS = assistant?.views;
  _mergeAccessGroupViewsIntoTarget(target, VIEWS);
}

const _mergeAssistantsIntoTarget = (
  target: IContextApplicationV1,
  assistants: Array<IAssistantV1>,
) => {
  if (
    !target.assistants
  ) {
    target.assistants = [];
  }
  if (
    !lodash.isEmpty(assistants) &&
    lodash.isArray(assistants)
  ) {
    for (const ASSISTANT of assistants) {
      const TARGET_ASSISTANT = target.assistants
        .find((item: IAssistantV1) => {
          let retVal = false;
          const ASSISTANT_ID = ASSISTANT?.id;
          const ITEM_ID = item?.id;
          if (
            ASSISTANT_ID &&
            ITEM_ID &&
            ASSISTANT_ID === ITEM_ID
          ) {
            retVal = true;
          }
          return retVal;
        });

      if (
        TARGET_ASSISTANT
      ) {
        _mergeAssistant(TARGET_ASSISTANT, ASSISTANT);
      } else {
        target.assistants.push(ASSISTANT);
      }
    }
  }
}

const _mergeApplication2ContextApplication = (
  target: IContextApplicationV1,
  application: IApplicationV1,
) => {
  const VIEWS = application?.views;
  const ASSISTANTS = application?.assistants;

  _mergeAccessGroupViewsIntoTarget(target, VIEWS);
  _mergeAssistantsIntoTarget(target, ASSISTANTS)
}

const _mergeApplications2ContextTenant = (
  target: IContextTenantV1,
  applications: Array<IApplicationV1>,
) => {
  if (
    !target.applications
  ) {
    target.applications = [];
  }

  if (
    !lodash.isEmpty(applications) &&
    lodash.isArray(applications)
  ) {
    for (const APPLICATION of applications) {
      const TARGET_APPLICATION = target.applications.find((item: IApplicationV1) => {
        let retVal = false;
        const APPLICATION_ID = APPLICATION?.id;
        const ITEM_ID = item?.id;
        if (
          APPLICATION_ID &&
          ITEM_ID &&
          APPLICATION_ID === ITEM_ID
        ) {
          retVal = true;
        }
        return retVal;
      });
      if (
        TARGET_APPLICATION
      ) {
        _mergeApplication2ContextApplication(TARGET_APPLICATION, APPLICATION);
      } else {
        target.applications.push(APPLICATION);
      }
    }
  }
}

const _mergeTenant2ContextTenant = (
  target: IContextTenantV1,
  tenant: ITenantV1,
) => {
  const APPLICATIONS = tenant?.applications;
  _mergeApplications2ContextTenant(target, APPLICATIONS);
}

const _mergeTenants2SessionAccessGroup = (
  target: IContextUserSessionAccessGroupV1,
  tenants: Array<ITenantV1>,
) => {
  if (
    !target.tenants
  ) {
    target.tenants = [];
  }
  if (
    !lodash.isEmpty(tenants)
  ) {
    for (const TENANT of tenants) {
      const TARGET_TENANT = target.tenants.find((item) => {
        let retVal = false;
        const TENANT_ID = TENANT?.id;
        const ITEM_ID = item?.id;
        if (
          TENANT_ID &&
          ITEM_ID &&
          TENANT_ID === ITEM_ID
        ) {
          retVal = true;
        }
        return retVal;
      });
      if (
        TARGET_TENANT
      ) {
        _mergeTenant2ContextTenant(TARGET_TENANT, TENANT);
      } else {
        target.tenants.push(TENANT);
      }
    }
  }
}

const _mergeAccessGroup2SessionAccessGroup = (
  target: IContextUserSessionAccessGroupV1,
  accessGroup: IAccessGroupV1,
) => {

  const VIEWS = accessGroup?.views;
  const TENANTS = accessGroup?.tenants;

  _mergeAccessGroupViewsIntoTarget(target, VIEWS);

  _mergeTenants2SessionAccessGroup(target, TENANTS);
}

const mergeAccessGroups2SessionAccessGroup = (
  accessGroups: Array<IAccessGroupV1>,
): IContextUserSessionAccessGroupV1 => {
  const RET_VAL: IContextUserSessionAccessGroupV1 = {};

  if (
    !lodash.isEmpty(accessGroups) &&
    lodash.isArray(accessGroups)
  ) {
    for (const ACCESS_GROUP of accessGroups) {
      _mergeAccessGroup2SessionAccessGroup(RET_VAL, ACCESS_GROUP);
    }
  }

  return RET_VAL;
}

const retrieveTenantIdsFromAccessGroup = (
  accessGroup: IAccessGroupV1,
): Array<string> => {
  const RET_VAL = [];
  const ACCESS_GROUP_TENANTS = accessGroup?.tenants;
  if (
    !lodash.isEmpty(ACCESS_GROUP_TENANTS)
  ) {
    RET_VAL.push(...ACCESS_GROUP_TENANTS.map((item: ITenantV1) => item.id));
  }
  return RET_VAL;
}

const hasTenantId = (
  accessGroup: {
    //
  },
  tenantId: any,
) => {
  let retVal = false;
  const ACCESS_GROUP_TENANT_IDS = retrieveTenantIdsFromAccessGroup(accessGroup);
  if (
    ACCESS_GROUP_TENANT_IDS.includes(tenantId)
  ) {
    retVal = true;
  }
  return retVal;
}

export {
  mergeAccessGroups2SessionAccessGroup,
  hasTenantId,
}

