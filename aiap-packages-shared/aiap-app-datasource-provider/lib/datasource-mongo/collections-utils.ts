/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-app-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IDatasourceConfigurationV1App,
} from '../types';

const DEFAULT_COLLECTIONS = {
  accessGroups: 'accessGroups',
  accessGroupsChanges: 'accessGroupsChanges',
  applications: 'applications',
  applicationsChanges: 'applicationsChanges',
  tenants: 'tenants',
  tenantsChanges: 'tenantsChanges',
  users: 'users',
  usersChanges: 'usersChanges',
};

export const sanitizedCollectionsFromConfiguration = (
  configuration: IDatasourceConfigurationV1App,
) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const ACCESS_GROUPS = COLLECTIONS_CONFIGURATION?.accessGroups;
  const ACCESS_GROUPS_CHANGES = COLLECTIONS_CONFIGURATION?.accessGroupsChanges;

  const APPLICATIONS = COLLECTIONS_CONFIGURATION.applications;
  const APPLICATIONS_CHANGES = COLLECTIONS_CONFIGURATION.applicationsChanges;

  const TENANTS = COLLECTIONS_CONFIGURATION.tenants;
  const TENANTS_CHANGES = COLLECTIONS_CONFIGURATION.tenantsChanges;

  const USERS = COLLECTIONS_CONFIGURATION.users;
  const USERS_CHANGES = COLLECTIONS_CONFIGURATION.usersChanges;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(ACCESS_GROUPS)
  ) {
    RET_VAL.accessGroups = ACCESS_GROUPS;
  }
  if (
    !lodash.isEmpty(ACCESS_GROUPS_CHANGES)
  ) {
    RET_VAL.accessGroupsChanges = ACCESS_GROUPS_CHANGES;
  }
  if (
    !lodash.isEmpty(APPLICATIONS)
  ) {
    RET_VAL.applications = APPLICATIONS;
  }
  if (
    !lodash.isEmpty(APPLICATIONS_CHANGES)
  ) {
    RET_VAL.applicationsChanges = APPLICATIONS_CHANGES;
  }
  if (
    !lodash.isEmpty(TENANTS)
  ) {
    RET_VAL.tenants = TENANTS;
  }
  if (
    !lodash.isEmpty(TENANTS_CHANGES)
  ) {
    RET_VAL.tenantsChanges = TENANTS_CHANGES;
  }
  if (
    !lodash.isEmpty(USERS)
  ) {
    RET_VAL.users = USERS;
  }
  if (
    !lodash.isEmpty(USERS_CHANGES)
  ) {
    RET_VAL.usersChanges = USERS_CHANGES;
  }
  return RET_VAL;
}
