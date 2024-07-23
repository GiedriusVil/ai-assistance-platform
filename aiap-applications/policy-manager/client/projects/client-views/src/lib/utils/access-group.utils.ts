// /*
//   © Copyright IBM Corporation 2022. All Rights Reserved 
   
//   SPDX-License-Identifier: EPL-2.0
// */
// import * as ramda from 'ramda';
// import * as lodash from 'lodash';

// import { _info } from './logger.utils';
// import { sortByField } from './utils';

// export function mergeAccessPolicyToAccessGroup(accessGroup: any, policy: any) {
//   const POLICY_TENANT = ramda.path(['tenant'], policy);
//   const POLICY_APPLICATION = ramda.path(['application'], policy);
//   const POLICY_PAGE = ramda.path(['page'], policy);

//   if (!accessGroup.tenants) {
//     accessGroup.tenants = [];
//   }
//   const ACCESS_GROUP_TENANT = accessGroup.tenants.find(item => POLICY_TENANT.id === item.id);
//   _info('mergeAccessPolicyToAccessGroup | ->', { ACCESS_GROUP_TENANT: lodash.cloneDeep(ACCESS_GROUP_TENANT) });
//   if (lodash.isEmpty(ACCESS_GROUP_TENANT)) {
//     accessGroup.tenants.push({
//       id: POLICY_TENANT.id,
//       name: POLICY_TENANT.name,
//       environmentId: POLICY_TENANT.environmentId,
//       applications: [{
//         id: POLICY_APPLICATION.id,
//         name: POLICY_APPLICATION.name,
//         pages: [POLICY_PAGE]
//       }]
//     });
//   } else {
//     if (lodash.isEmpty(ACCESS_GROUP_TENANT.applications)) {
//       ACCESS_GROUP_TENANT.applications = [];
//     }
//     const ACCESS_GROUP_TENANT_APPLICATION = ACCESS_GROUP_TENANT.applications.find(item => POLICY_APPLICATION.id === item.id);
//     _info('mergeAccessPolicyToAccessGroup | ->', { ACCESS_GROUP_TENANT_APPLICATION: lodash.cloneDeep(ACCESS_GROUP_TENANT_APPLICATION) });
//     if (lodash.isEmpty(ACCESS_GROUP_TENANT_APPLICATION)) {
//       ACCESS_GROUP_TENANT.applications.push({
//         id: POLICY_APPLICATION.id,
//         name: POLICY_APPLICATION.name,
//         pages: [POLICY_PAGE]
//       });
//     } else {
//       if (lodash.isEmpty(ACCESS_GROUP_TENANT_APPLICATION.pages)) {
//         ACCESS_GROUP_TENANT_APPLICATION.pages = [];
//       }
//       const APPLICATION_PAGE = ACCESS_GROUP_TENANT_APPLICATION.pages.find(item => item.componentInRoleTable === POLICY_PAGE.componentInRoleTable);
//       const NEW_PAGE = _getAlignedPage(APPLICATION_PAGE, POLICY_PAGE);
//       const NEW_PAGES = [NEW_PAGE];
//       for (let page of ACCESS_GROUP_TENANT_APPLICATION.pages) {
//         if (
//           page &&
//           POLICY_PAGE &&
//           page.componentInRoleTable !== POLICY_PAGE.componentInRoleTable
//         ) {
//           NEW_PAGES.push(page);
//         }
//       }
//       ACCESS_GROUP_TENANT_APPLICATION.pages = NEW_PAGES;
//     }
//   }
// }

// function _getAlignedPage(oldPage: any, newPage: any) {
//   let retVal = newPage;
//   if (!lodash.isEmpty(newPage) && !lodash.isEmpty(oldPage)) {
//     const OLD_PAGE_CHECKED_ACTIONS = oldPage.actions.filter(item => item.checked);
//     const NEW_PAGE_ACTIONS = retVal.actions;
//     if (!lodash.isEmpty(NEW_PAGE_ACTIONS)) {
//       for (let action of NEW_PAGE_ACTIONS) {
//         const CHECKED_ACTION = OLD_PAGE_CHECKED_ACTIONS.find(item => item.component === action.component);
//         if (CHECKED_ACTION) {
//           action.checked = true;
//         }
//       }
//     }
//   }
//   return retVal;
// }

// /** Adds page with actions */
// export function mergeApplicationPolicyToAccessGroup(accessGroup: any, policy: any) {
//   _info('mergeApplicationPolicyToAccessGroup | ->', {
//     policy: policy,
//     accessGroupPages: accessGroup.pages,
//   });
//   const POLICY_PAGE = ramda.path(['page'], policy);
//   if (!accessGroup.pages) {
//     accessGroup.pages = [];
//   }
//   const ACCESS_GROUP_PAGE = accessGroup.pages.find(item => item.componentInRoleTable === POLICY_PAGE.componentInRoleTable);
//   const NEW_PAGE = _getAlignedPage(ACCESS_GROUP_PAGE, POLICY_PAGE);
//   const NEW_PAGES = [NEW_PAGE];
//   for (let page of accessGroup.pages) {
//     if (
//       page &&
//       POLICY_PAGE &&
//       page.componentInRoleTable !== POLICY_PAGE.componentInRoleTable
//     ) {
//       NEW_PAGES.push(page);
//     }
//   }
//   accessGroup.pages = NEW_PAGES;

//   _info('mergeApplicationPolicyToAccessGroup | ->', {
//     accessGroupPages: accessGroup.pages,
//     newPages: NEW_PAGES
//   });
// }

// const BY_FIELD_NAME_FN = sortByField('name');
// const BY_FIELD_TITLE_FN = sortByField('title');

// /** Sort nested arrays: tenants > pages > actions */
// export function sortTenantSummary(tenants) {
//   if (tenants) {
//     const TENANTS_SORTED_BY_NAME = ramda.sort(BY_FIELD_NAME_FN, tenants);
//     TENANTS_SORTED_BY_NAME.forEach((tenant, tenantIndex) => {
//       const APPLICATIONS = tenant.applications;

//       if (APPLICATIONS) {
//         const APPLICATIONS_SORTED_BY_NAME = ramda.sort(BY_FIELD_NAME_FN, APPLICATIONS);
//         TENANTS_SORTED_BY_NAME[tenantIndex].applications = APPLICATIONS_SORTED_BY_NAME;

//         TENANTS_SORTED_BY_NAME[tenantIndex].applications.forEach((application, applicationIndex) => {
//           const PAGES = application.pages;
//           if (PAGES) {
//             const PAGES_SORTED_BY_TITLE = ramda.sort(BY_FIELD_TITLE_FN, PAGES);
//             TENANTS_SORTED_BY_NAME[tenantIndex].applications[applicationIndex].pages = PAGES_SORTED_BY_TITLE;

//             TENANTS_SORTED_BY_NAME[tenantIndex].applications[applicationIndex].pages.forEach((page, pageIndex) => {
//               const ACTIONS = page.actions;
//               if (ACTIONS) {
//                 const ACTIONS_SORTED_BY_NAME = ramda.sort(BY_FIELD_TITLE_FN, ACTIONS);
//                 TENANTS_SORTED_BY_NAME[tenantIndex].applications[applicationIndex].pages[pageIndex].actions = ACTIONS_SORTED_BY_NAME;
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// }

// /** Sort nested arrays: pages > actions */
// export function sortApplicationSummary(pages) {
//   if (pages) {
//     const PAGES_SORTED_BY_TITLE = ramda.sort(BY_FIELD_TITLE_FN, pages);

//     PAGES_SORTED_BY_TITLE.forEach((page, pageIndex) => {
//       const ACTIONS = page.actions;
//       if (ACTIONS) {
//         const ACTIONS_SORTED_BY_NAME = ramda.sort(BY_FIELD_TITLE_FN, ACTIONS);
//         pages[pageIndex].actions = ACTIONS_SORTED_BY_NAME;
//       }
//     });
//   }
// }

// export function createAccessGroupPayload(accessGroup) {
//   if (!accessGroup) {
//     return accessGroup;
//   }
//   const ACCESS_GROUP = lodash.cloneDeep(accessGroup);

//   for (let accessGroupTenant of ACCESS_GROUP.tenants) {
//     delete accessGroupTenant.environmentId;
//   }

//   return ACCESS_GROUP;
// }
