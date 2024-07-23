/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
// eslint-disable-next-line no-unused-vars
const MODULE_ID = 'user-session-provider-session-permissions.utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

const _mergeViewActionsIntoTarget = (
  target: any,
  views: any,
  addAttributes = undefined
) => {
  try {
    if (
      target &&
      !lodash.isEmpty(views) &&
      lodash.isArray(views)
    ) {
      for (const VIEW of views) {
        const VIEW_ACTIONS = VIEW?.actions;

        if (
          !lodash.isEmpty(VIEW_ACTIONS) &&
          lodash.isArray(VIEW_ACTIONS)
        ) {
          for (const VIEW_ACTION of VIEW_ACTIONS) {
            const VIEW_ACTION_COMPONENT = VIEW_ACTION?.component;

            if (
              !lodash.isEmpty(VIEW_ACTION_COMPONENT)
            ) {
              if (
                !lodash.isEmpty(addAttributes)
              ) {
                target[VIEW_ACTION_COMPONENT] = {
                  enabled: true,
                }
              } else {
                target[VIEW_ACTION_COMPONENT] = {
                  enabled: true,
                  ...addAttributes
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_mergeViewActionsIntoTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _mergeViewsIntoTarget = (
  target: any,
  views: any,
  addAttributes = undefined,
) => {
  try {
    if (
      target &&
      !lodash.isEmpty(views) &&
      lodash.isArray(views)
    ) {
      for (const VIEW of views) {
        const VIEW_COMPONENT = VIEW?.component;

        if (
          !lodash.isEmpty(VIEW_COMPONENT)
        ) {
          if (
            lodash.isEmpty(addAttributes)
          ) {
            target[VIEW_COMPONENT] = {
              enabled: true,
            }
          } else {
            target[VIEW_COMPONENT] = {
              enabled: true,
              ...addAttributes
            }
          }
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_mergeViewsIntoTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupTenantApplicationAssistantsViewActions = (
  assistants: any,
) => {
  const RET_VAL = {};
  try {
    if (
      !lodash.isEmpty(assistants) &&
      lodash.isArray(assistants)
    ) {
      for (const ASSISTANT of assistants) {
        const APPLICATION_ID = ASSISTANT?.applicationId;
        const ASSISTANT_ID = ASSISTANT?.assistantId;
        const ASSISTANT_VIEWS = ASSISTANT?.views;
        _mergeViewActionsIntoTarget(
          RET_VAL,
          ASSISTANT_VIEWS,
          {
            applicationId: APPLICATION_ID,
            assistantId: ASSISTANT_ID,
          });
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupTenantApplicationAssistantsViewActions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupTenantApplicationAssistantsViews = (
  assistants: any,
) => {
  const RET_VAL = {};
  try {
    if (
      !lodash.isEmpty(assistants) &&
      lodash.isArray(assistants)
    ) {
      for (const ASSISTANT of assistants) {
        const APPLICATION_ID = ASSISTANT?.applicationId;
        const ASSISTANT_ID = ASSISTANT?.assistantId;
        const ASSISTANT_VIEWS = ASSISTANT?.views;
        _mergeViewsIntoTarget(
          RET_VAL,
          ASSISTANT_VIEWS,
          {
            applicationId: APPLICATION_ID,
            assistantId: ASSISTANT_ID,
          });
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupTenantApplicationAssistantsViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupTenantApplicationViewActions = (
  applications: any,
) => {
  const RET_VAL = {};
  try {
    if (
      !lodash.isEmpty(applications) &&
      lodash.isArray(applications)
    ) {
      for (const APPLICATION of applications) {
        const APPLICATION_ID = APPLICATION?.id;
        const APPLICATION_VIEWS = APPLICATION?.views;
        _mergeViewActionsIntoTarget(
          RET_VAL,
          APPLICATION_VIEWS,
          {
            applicationId: APPLICATION_ID,
          });
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupTenantApplicationViewActions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupTenantApplicationViews = (
  applications: any,
) => {
  const RET_VAL = {};
  try {
    if (
      !lodash.isEmpty(applications) &&
      lodash.isArray(applications)
    ) {
      for (const APPLICATION of applications) {
        const APPLICATION_ID = APPLICATION?.applicationId;
        const APPLICATION_VIEWS = APPLICATION?.views;
        _mergeViewsIntoTarget(
          RET_VAL,
          APPLICATION_VIEWS,
          {
            applicationId: APPLICATION_ID,
          }
        );
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupTenantApplicationViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupViewActions = (
  views: any,
) => {
  const RET_VAL = {};
  try {
    _mergeViewActionsIntoTarget(RET_VAL, views);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupViewActions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupViews = (
  views: any,
) => {
  const RET_VAL = {};
  try {
    _mergeViewsIntoTarget(RET_VAL, views);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupTenantViews = (
  views: any,
) => {
  const RET_VAL = {};
  try {
    _mergeViewsIntoTarget(RET_VAL, views);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeAccessGroupTenantViewActions = (
  views: any,
) => {
  const RET_VAL = {};
  try {
    if (
      !lodash.isEmpty(views) &&
      lodash.isArray(views)
    ) {
      _mergeViewActionsIntoTarget(RET_VAL, views);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_sanitizeAccessGroupTenantViewActions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveAccessGroupTenantApplicationAssistantsViews = (
  accessGroupTenants: any,
  sessionTenantId: any,
) => {
  let accessGroupTenant;
  let accessGroupTenantApplications;
  const RET_VAL = [];
  try {
    accessGroupTenant = lodash.find(accessGroupTenants, tenant => tenant?.id == sessionTenantId);
    accessGroupTenantApplications = accessGroupTenant?.applications;
    if (
      !lodash.isEmpty(accessGroupTenantApplications) &&
      lodash.isArray(accessGroupTenantApplications)
    ) {
      for (const APPLICATION of accessGroupTenantApplications) {
        if (
          !lodash.isEmpty(APPLICATION)
        ) {
          const APPLICATION_ID = APPLICATION?.id;
          const APPLICATION_ASSISTANTS = APPLICATION?.assistants;

          if (
            !lodash.isEmpty(APPLICATION_ASSISTANTS) &&
            lodash.isArray(APPLICATION_ASSISTANTS)
          ) {
            for (const ASSISTANT of APPLICATION_ASSISTANTS) {
              const ASSISTANT_ID = ASSISTANT?.id;
              const VIEWS = ASSISTANT?.views;
              const ASSISTANT_VIEWS = {
                applicationId: APPLICATION_ID,
                assistantId: ASSISTANT_ID,
                views: VIEWS,
              }
              RET_VAL.push(ASSISTANT_VIEWS);
            }
          }
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveAccessGroupTenantApplicationAssistantsViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveAccessGroupTenantApplicationsViews = (
  accessGroupTenants: any,
  sessionTenantId: any,
) => {
  let accessGroupTenant;
  let accessGroupTenantApplications;
  const RET_VAL = [];
  try {
    accessGroupTenant = lodash.find(accessGroupTenants, tenant => tenant?.id == sessionTenantId);
    accessGroupTenantApplications = accessGroupTenant?.applications;
    if (
      !lodash.isEmpty(accessGroupTenantApplications) &&
      lodash.isArray(accessGroupTenantApplications)
    ) {
      for (const APPLICATION of accessGroupTenantApplications) {
        if (
          !lodash.isEmpty(APPLICATION)
        ) {
          const APPLICATION_ID = APPLICATION?.id;
          const VIEWS = APPLICATION?.views;
          const APPLICATION_VIEWS = {
            applicationId: APPLICATION_ID,
            views: VIEWS,
          }
          RET_VAL.push(APPLICATION_VIEWS);
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveAccessGroupTenantApplicationsViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveAccessGroupTenantViews = (
  accessGroupTenants: any,
  sessionTenantId: any,
) => {
  let retVal;
  let accessGroupTenant;
  try {
    accessGroupTenant = lodash.find(accessGroupTenants, t => t.id == sessionTenantId);
    retVal = ramda.pathOr([], ['views'], accessGroupTenant);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveAccessGroupTenantViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export const retrieveSessionPermissions = (
  request: any,
) => {
  let context;

  let session;
  let sessionTenantId;

  let accessGroup;
  let accessGroupViews;
  let accessGroupTenants;

  let accessGroupTenantViews;
  let accessGroupTenantApplicationsViews;
  let accessGroupTenantApplicationAssistantsViews;

  let allowedAccessGroupViews;
  let allowedAccessGroupViewActions;

  let allowedAccessGroupTenantViews;
  let allowedAccessGroupTenantViewActions;

  let allowedAccessGroupTenantApplicationViews;
  let allowedAccessGroupTenantApplicationViewActions;

  let allowedAccessGroupTenantApplicationAssistantViews;
  let allowedAccessGroupTenantApplicationAssistantViewActions;

  const RET_VAL: {
    allowedViews?: any,
    allowedActions?: any,
  } = {};
  try {
    context = constructActionContextFromRequest(request);

    session = context?.user?.session;

    if (
      !lodash.isEmpty(session)
    ) {
      sessionTenantId = session?.tenant?.id;

      accessGroup = session?.accessGroup;
      accessGroupTenants = accessGroup?.tenants;

      accessGroupViews = accessGroup?.views;

      accessGroupTenantViews = _retrieveAccessGroupTenantViews(accessGroupTenants, sessionTenantId);
      accessGroupTenantApplicationsViews = _retrieveAccessGroupTenantApplicationsViews(accessGroupTenants, sessionTenantId);
      accessGroupTenantApplicationAssistantsViews = _retrieveAccessGroupTenantApplicationAssistantsViews(accessGroupTenants, sessionTenantId);

      allowedAccessGroupViews = _sanitizeAccessGroupViews(accessGroupViews);
      allowedAccessGroupViewActions = _sanitizeAccessGroupViewActions(accessGroupViews);

      allowedAccessGroupTenantViews = _sanitizeAccessGroupTenantViews(accessGroupTenantViews);
      allowedAccessGroupTenantViewActions = _sanitizeAccessGroupTenantViewActions(accessGroupTenantViews);

      allowedAccessGroupTenantApplicationViews = _sanitizeAccessGroupTenantApplicationViews(accessGroupTenantApplicationsViews);
      allowedAccessGroupTenantApplicationViewActions = _sanitizeAccessGroupTenantApplicationViewActions(accessGroupTenantApplicationsViews);

      allowedAccessGroupTenantApplicationAssistantViews = _sanitizeAccessGroupTenantApplicationAssistantsViews(accessGroupTenantApplicationAssistantsViews);
      allowedAccessGroupTenantApplicationAssistantViewActions = _sanitizeAccessGroupTenantApplicationAssistantsViewActions(accessGroupTenantApplicationAssistantsViews);

      RET_VAL.allowedViews = lodash.merge(
        allowedAccessGroupViews,
        allowedAccessGroupTenantViews,
        allowedAccessGroupTenantApplicationViews,
        allowedAccessGroupTenantApplicationAssistantViews,
      );
      RET_VAL.allowedActions = lodash.merge(
        allowedAccessGroupViewActions,
        allowedAccessGroupTenantViewActions,
        allowedAccessGroupTenantApplicationViewActions,
        allowedAccessGroupTenantApplicationAssistantViewActions,
      );
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveSessionPermissions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
