/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _info,
  sortByField,
} from 'client-shared-utils';

export function mergeAccessPolicyToAccessGroup(accessGroup: any, policy: any) {
  const POLICY_TENANT = ramda.path(['tenant'], policy);
  const POLICY_PAGE = ramda.path(['page'], policy);

  if (!accessGroup.tenants) {
    accessGroup.tenants = [];
  }

  const ACCESS_GROUP_TENANT = accessGroup.tenants.find(item => {
    let retVal = false;
    if (
      POLICY_TENANT &&
      item &&
      POLICY_TENANT.id === item.id
    ) {
      retVal = true;
    }
    return retVal;
  });

  if (!ACCESS_GROUP_TENANT) {
    accessGroup.tenants.push({
      id: POLICY_TENANT.id,
      name: POLICY_TENANT.name,
      environmentId: POLICY_TENANT.environmentId,
      pages: [POLICY_PAGE]
    });
  } else {
    if (!ACCESS_GROUP_TENANT.pages) {
      ACCESS_GROUP_TENANT.pages = [];
    }
    const NEW_PAGES = [POLICY_PAGE];
    for (let page of ACCESS_GROUP_TENANT.pages) {
      if (
        page &&
        POLICY_PAGE &&
        page.componentInRoleTable !== POLICY_PAGE.componentInRoleTable
      ) {
        NEW_PAGES.push(page);
      }
    }
    ACCESS_GROUP_TENANT.pages = NEW_PAGES;
  }
}

/** Adds page with actions */
export function mergeApplicationPolicyToAccessGroup(accessGroup: any, policy: any) {
  _info('mergeApplicationPolicyToAccessGroup | ->', {
    policy: policy,
    accessGroupPages: accessGroup.pages,
  });
  const POLICY_PAGE = ramda.path(['page'], policy);
  if (!accessGroup.pages) {
    accessGroup.pages = [];
  }
  const NEW_PAGES = [POLICY_PAGE];
  for (let page of accessGroup.pages) {
    if (
      page &&
      POLICY_PAGE &&
      page.componentInRoleTable !== POLICY_PAGE.componentInRoleTable
    ) {
      NEW_PAGES.push(page);
    }
  }
  accessGroup.pages = NEW_PAGES;

  _info('mergeApplicationPolicyToAccessGroup | ->', {
    accessGroupPages: accessGroup.pages,
    newPages: NEW_PAGES
  });
}

const BY_FIELD_NAME_FN = sortByField('name');
const BY_FIELD_TITLE_FN = sortByField('title');

/** Sort nested arrays: tenants > pages > actions */
export function sortTenantSummary(tenants) {
  if (tenants) {
    const TENANTS_SORTED_BY_NAME = ramda.sort(BY_FIELD_NAME_FN, tenants);
    TENANTS_SORTED_BY_NAME.forEach((tenant, tenantIndex) => {

      const PAGES = tenant.pages;
      if (PAGES) {
        const PAGES_SORTED_BY_TITLE = ramda.sort(BY_FIELD_TITLE_FN, PAGES);
        TENANTS_SORTED_BY_NAME[tenantIndex].pages = PAGES_SORTED_BY_TITLE;

        TENANTS_SORTED_BY_NAME[tenantIndex].pages.forEach((page, pageIndex) => {
          const ACTIONS = page.actions;
          if (ACTIONS) {
            const ACTIONS_SORTED_BY_NAME = ramda.sort(BY_FIELD_TITLE_FN, ACTIONS);
            TENANTS_SORTED_BY_NAME[tenantIndex].pages[pageIndex].actions = ACTIONS_SORTED_BY_NAME;
          }
        });
      }

    });
  }
}

/** Sort nested arrays: pages > actions */
export function sortApplicationSummary(pages) {
  if (pages) {
    const PAGES_SORTED_BY_TITLE = ramda.sort(BY_FIELD_TITLE_FN, pages);

    PAGES_SORTED_BY_TITLE.forEach((page, pageIndex) => {
      const ACTIONS = page.actions;
      if (ACTIONS) {
        const ACTIONS_SORTED_BY_NAME = ramda.sort(BY_FIELD_TITLE_FN, ACTIONS);
        pages[pageIndex].actions = ACTIONS_SORTED_BY_NAME;
      }
    });
  }
}

export function createAccessGroupPayload(accessGroup) {
  if (!accessGroup) {
    return accessGroup;
  }
  const ACCESS_GROUP = lodash.cloneDeep(accessGroup);

  for (let accessGroupTenant of ACCESS_GROUP.tenants) {
    delete accessGroupTenant.environmentId;
  }

  return ACCESS_GROUP;
}
