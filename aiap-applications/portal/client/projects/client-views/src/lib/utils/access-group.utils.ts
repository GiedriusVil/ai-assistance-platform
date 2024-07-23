/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  sortByField,
} from 'client-shared-utils';

const MODULE_ID = 'acces-group-utils';

export function mergeTenantPolicyViewIntoTarget(target: any, view: any) {
  _debugX(MODULE_ID, 'mergeTenantPolicyViewIntoTarget', { target, view });
  let policyView;
  try {
    if (
      !target?.views
    ) {
      target.views = [];
    }
    policyView = target.views.find((item: any) => view.component === item.component);
    if (
      lodash.isEmpty(policyView)
    ) {
      policyView = {
        name: view?.name,
        component: view?.component,
        actions: [],
      };
      target.views.push(policyView);
    }
    if (
      !policyView.actions
    ) {
      policyView.actions = [];
    }
    if (
      !lodash.isEmpty(view.actions) &&
      lodash.isArray(view.actions)
    ) {
      for (let action of view.actions) {
        let tmpAction = policyView.actions?.find((item: any) => action?.component === item.component);
        if (
          action.checked &&
          lodash.isEmpty(tmpAction)
        ) {
          policyView.actions.push({
            name: action?.name,
            component: action?.component,
          });
        }
      }
    }
  } catch (error) {
    _errorX(MODULE_ID, 'mergeTenantPolicyViewIntoTarget', { error });
    throw error;
  }
}

export function mergeTenantPolicyToAccessGroup(accessGroup: any, policy: any) {
  let policyTenant;
  let policyApplication;
  let policyAssistant;
  let policyViews;

  let accessGroupTenant;
  let accessGroupTenantApplication;
  let accessGroupTenantApplicationAssistant;

  try {
    policyTenant = policy?.tenant;
    policyApplication = policy?.application;
    policyAssistant = policy?.assistant;
    policyViews = policy?.views;

    if (!accessGroup.tenants) {
      accessGroup.tenants = [];
    }
    accessGroupTenant = accessGroup.tenants.find((item: any) => policyTenant?.id === item.id);
    _debugX(MODULE_ID, 'mergeTenantPolicyToAccessGroup', { accessGroupTenant: lodash.cloneDeep(accessGroupTenant) });
    if (
      lodash.isEmpty(accessGroupTenant)
    ) {
      accessGroupTenant = {
        id: policyTenant?.id || '',
        name: policyTenant?.name || '',
        environmentId: policyTenant?.environment?.id || '',
        applications: []
      };
      accessGroup.tenants.push(accessGroupTenant);
    }
    if (
      !accessGroupTenant.applications
    ) {
      accessGroupTenant.applications = [];
    }
    accessGroupTenantApplication = accessGroupTenant.applications.find((item: any) => policyApplication?.id === item.id);
    if (
      lodash.isEmpty(accessGroupTenantApplication)
    ) {
      accessGroupTenantApplication = {
        id: policyApplication?.id,
        name: policyApplication?.name,
        assistants: [],
        views: [],
      };
      accessGroupTenant.applications.push(accessGroupTenantApplication);
    }
    if (
      !accessGroupTenantApplication.assistants
    ) {
      accessGroupTenantApplication.assistants = [];
    }
    if (
      !accessGroupTenantApplication.views
    ) {
      accessGroupTenantApplication.views = [];
    }
    if (
      lodash.isEmpty(policyAssistant)
    ) {
      policyViews?.forEach(policyView => {
        mergeTenantPolicyViewIntoTarget(accessGroupTenantApplication, policyView);
      });
    } else {
      accessGroupTenantApplicationAssistant = accessGroupTenantApplication.assistants.find((item: any) => policyAssistant?.id === item.id);
      if (
        lodash.isEmpty(accessGroupTenantApplicationAssistant)
      ) {
        accessGroupTenantApplicationAssistant = {
          id: policyAssistant?.id,
          name: policyAssistant?.name,
          views: [],
        };
        accessGroupTenantApplication.assistants.push(accessGroupTenantApplicationAssistant);
      }
      policyViews?.forEach(policyView => {
        mergeTenantPolicyViewIntoTarget(accessGroupTenantApplicationAssistant, policyView);
      });
    }
    _debugX(MODULE_ID, 'mergeTenantPolicyToAccessGroup', { accessGroup: lodash.cloneDeep(accessGroup), policy: policy });
  } catch (error) {
    _errorX(MODULE_ID, 'mergeTenantPolicyToAccessGroup', { error });
    throw error;
  }
}

export function mergeApplicationPolicyToAccessGroup(accessGroup: any, policy: any) {
  let policyTenant;
  let policyApplication;
  let policyAssistant;
  let policyViews;

  let accessGroupTenant;
  let accessGroupTenantApplication;
  let accessGroupTenantApplicationAssistant;

  try {
    policyTenant = policy?.tenant;
    policyApplication = policy?.application;
    policyAssistant = policy?.assistant;
    policyViews = policy?.views;

    if (!accessGroup.tenants) {
      accessGroup.tenants = [];
    }
    accessGroupTenant = accessGroup.tenants.find((item: any) => lodash.isEmpty(item?.id) && lodash.isEmpty(item.id));
    _debugX(MODULE_ID, 'mergeApplicationPolicyToAccessGroup', { accessGroupTenant: lodash.cloneDeep(accessGroupTenant) });

    if (
      lodash.isEmpty(accessGroupTenant)
    ) {
      accessGroupTenant = {
        id: policyTenant?.id || '',
        name: policyTenant?.name || '',
        environmentId: policyTenant?.environment?.id || '',
        applications: []
      };
      accessGroup.tenants.push(accessGroupTenant);
    }
    if (
      !accessGroupTenant.applications
    ) {
      accessGroupTenant.applications = [];
    }
    accessGroupTenantApplication = accessGroupTenant.applications.find((item: any) => policyApplication?.id === item.id);
    if (
      lodash.isEmpty(accessGroupTenantApplication)
    ) {
      accessGroupTenantApplication = {
        id: policyApplication?.id,
        name: policyApplication?.name,
        assistants: [],
        views: [],
      };
      accessGroupTenant.applications.push(accessGroupTenantApplication);
    }
    if (
      !accessGroupTenantApplication.assistants
    ) {
      accessGroupTenantApplication.assistants = [];
    }
    if (
      !accessGroupTenantApplication.views
    ) {
      accessGroupTenantApplication.views = [];
    }
    if (
      lodash.isEmpty(policyAssistant)
    ) {
      policyViews?.forEach(policyView => {
        mergeTenantPolicyViewIntoTarget(accessGroupTenantApplication, policyView);
      });
    } else {
      accessGroupTenantApplicationAssistant = accessGroupTenantApplication.assistants.find((item: any) => policyAssistant?.id === item.id);
      if (
        lodash.isEmpty(accessGroupTenantApplicationAssistant)
      ) {
        accessGroupTenantApplicationAssistant = {
          id: policyAssistant?.id,
          name: policyAssistant?.name,
          views: [],
        };
        accessGroupTenantApplication.assistants.push(accessGroupTenantApplicationAssistant);
      }
      policyViews?.forEach(policyView => {
        mergeTenantPolicyViewIntoTarget(accessGroupTenantApplicationAssistant, policyView);
      });
    }
    _debugX(MODULE_ID, 'mergeApplicationPolicyToAccessGroup', { accessGroup: lodash.cloneDeep(accessGroup), policy: policy });
  } catch (error) {
    _errorX(MODULE_ID, 'mergeApplicationPolicyToAccessGroup', { error });
    throw error;
  }
}

/** Adds page with actions */
export function mergePlatformPolicyToAccessGroup(accessGroup: any, policy: any) {
  let policyView;
  try {
    policyView = policy?.view;
    mergeTenantPolicyViewIntoTarget(accessGroup, policyView);
    _debugX(MODULE_ID, 'mergePlatformPolicyToAccessGroup', { accessGroup: lodash.cloneDeep(accessGroup), policy: policy });
  } catch (error: any) {
    _errorX(MODULE_ID, 'mergePlatformPolicyToAccessGroup', { error });
    throw error;
  }
}

const BY_FIELD_NAME_FN = sortByField('name');

export function sortTargetPolicyViews(target: any) {
  let views = target?.views;
  if (
    !lodash.isEmpty(views) &&
    lodash.isArray(views)
  ) {
    let viewsSortedByName = ramda.sort(BY_FIELD_NAME_FN, views);
    target.views = viewsSortedByName;
    viewsSortedByName.forEach((view: any) => {
      let actions = view?.actions;
      if (
        !lodash.isEmpty(actions) &&
        lodash.isArray(actions)
      ) {
        let actionsSortedByName = ramda.sort(BY_FIELD_NAME_FN, actions);
        view.actions = actionsSortedByName;
      }
    });
  }
}

export function sortTenantPolicySummary(accessGroup: any) {
  let tenants;
  try {
    tenants = accessGroup?.tenants;
    if (
      !lodash.isEmpty(tenants) &&
      lodash.isArray(tenants)
    ) {
      console.log('[sortTenantPolicySummary]: ', { BY_FIELD_NAME_FN, tenants });
      let tenantsSortedByName = ramda.sort(BY_FIELD_NAME_FN, tenants);
      accessGroup.tenants = tenantsSortedByName;
      tenantsSortedByName.forEach((tenant: any) => {
        let applications = tenant?.applications;
        if (
          !lodash.isEmpty(applications) &&
          lodash.isArray(applications)
        ) {
          let applicationsSortedByName = ramda.sort(BY_FIELD_NAME_FN, applications);
          tenant.applications = applicationsSortedByName;
          applicationsSortedByName.forEach((application: any) => {
            sortTargetPolicyViews(application);
            let assistants = application?.assistants;
            if (
              !lodash.isEmpty(assistants) &&
              lodash.isArray(assistants)
            ) {
              let assistantsSortedByName = ramda.sort(BY_FIELD_NAME_FN, assistants);
              application.assistants = assistantsSortedByName;
              assistantsSortedByName.forEach((assistant: any) => {
                sortTargetPolicyViews(assistant);
              });
            }
          });
        }
      });
    }
  } catch (error) {
    _errorX(MODULE_ID, 'sortTenantPolicySummary', { error });
    throw error;
  }
}

export function sortPlatformPolicySummary(accessGroup: any) {
  try {
    sortTargetPolicyViews(accessGroup);
  } catch (error) {
    _errorX(MODULE_ID, 'sortPlatformPolicySummary', { error });
    throw error;
  }
}

export function createAccessGroupPayload(accessGroup) {
  if (!accessGroup) {
    return accessGroup;
  }
  const RET_VAL = lodash.cloneDeep(accessGroup);
  const ACCESS_GROUP_TENANTS = RET_VAL?.tenants;
  if (
    !lodash.isEmpty(ACCESS_GROUP_TENANTS) &&
    lodash.isArray(ACCESS_GROUP_TENANTS)
  ) {
    for (let accessGroupTenant of ACCESS_GROUP_TENANTS) {
      delete accessGroupTenant.environmentId;
    }
  }
  return RET_VAL;
}
