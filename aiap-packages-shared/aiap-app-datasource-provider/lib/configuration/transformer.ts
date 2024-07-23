/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const isTrue = (
  value: any,
) => {
  let retVal = false;
  if (
    lodash.isString(value) &&
    value === 'true'
  ) {
    retVal = true;
  } else if (
    lodash.isBoolean(value) &&
    value
  ) {
    retVal = true;
  }
  return retVal;
};

const user = (
  username,
  password,
  accessGroupId
) => {
  let retVal: any = false;
  if (
    !lodash.isEmpty(username) &&
    !lodash.isEmpty(password) &&
    !lodash.isEmpty(accessGroupId)
  ) {
    retVal = {
      username,
      password,
      accessGroupId,
    };
  }
  return retVal;
}

const users = (
  flatClient: any,
) => {
  let retVal: any = false;
  const DEFAULT_USERS_ENABLED = flatClient?.defaultUsersEnabled;
  if (
    isTrue(DEFAULT_USERS_ENABLED)
  ) {
    retVal = {
      admin: user(
        flatClient?.defaultUserAdminUsername,
        flatClient?.defaultUserAdminPassword,
        flatClient?.defaultUserAdminAccessGroupId,
      ),
      developer: user(
        flatClient?.defaultUserDeveloperUsername,
        flatClient?.defaultUserDeveloperPassword,
        flatClient?.defaultUserDeveloperAccessGroupId,
      ),
      tester: user(
        flatClient?.defaultUserTesterUsername,
        flatClient?.defaultUserTesterPassword,
        flatClient?.defaultUserTesterAccessGroupId,
      )
    };
  }
  return retVal;
}

const datasource = (
  flatClient: any,
) => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    users: users(flatClient),
    collections: {
      applications: flatClient?.collectionApplications,
      applicationsChanges: flatClient?.collectionApplicationsChanges,
      tenants: flatClient?.collectionTenants,
      tenantsChanges: flatClient?.collectionTenantsChanges,
      accessGroups: flatClient?.collectionAccessGroups,
      accessGroupsChanges: flatClient?.collectionAccessGroupsChanges,
      users: flatClient?.collectionUsers,
      usersChanges: flatClient?.collectionUsersChanges,
    },
    defaultTenantsEnabled: isTrue(flatClient?.defaultTenantsEnabled),
    defaultAccessGroupsEnabled: isTrue(flatClient?.defaultAccessGroupsEnabled),
    defaultEngagementsEnabled: isTrue(flatClient?.defaultEngagementsEnabled),
    encryptionKey: flatClient?.encryptionKey || 'someKey',
  }
  return RET_VAL;
}

const datasources = (
  flatSources: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatSources)
  ) {
    for (const FLAT_SOURCE of flatSources) {
      const TMP_DATASOURCE = datasource(FLAT_SOURCE);
      if (
        !lodash.isEmpty(FLAT_SOURCE) &&
        !lodash.isEmpty(TMP_DATASOURCE)
      ) {
        RET_VAL.push(TMP_DATASOURCE);
      }
    }
  }
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const CLIENTS_FLAT = provider.getKeys(
    'APP_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_APPLICATIONS',
      'COLLECTION_APPLICATIONS_CHANGES',
      'COLLECTION_TENANTS',
      'COLLECTION_TENANTS_CHANGES',
      'COLLECTION_ACCESS_GROUPS',
      'COLLECTION_ACCESS_GROUPS_CHANGES',
      'COLLECTION_USERS',
      'COLLECTION_USERS_CHANGES',
      'DEFAULT_TENANTS_ENABLED',
      'DEFAULT_ACCESS_GROUPS_ENABLED',
      'DEFAULT_ENGAGEMENTS_ENABLED',
      'DEFAULT_USERS_ENABLED',
      'DEFAULT_USER_ADMIN_USERNAME',
      'DEFAULT_USER_ADMIN_PASSWORD',
      'DEFAULT_USER_ADMIN_ACCESS_GROUP_ID',
      'DEFAULT_USER_DEVELOPER_USERNAME',
      'DEFAULT_USER_DEVELOPER_PASSWORD',
      'DEFAULT_USER_DEVELOPER_ACCESS_GROUP_ID',
      'DEFAULT_USER_TESTER_USERNAME',
      'DEFAULT_USER_TESTER_PASSWORD',
      'DEFAULT_USER_TESTER_ACCESS_GROUP_ID',
      'DEFAULT_USER_COH_ADMIN_USERNAME',
      'DEFAULT_USER_COH_ADMIN_PASSWORD',
      'DEFAULT_USER_COH_ADMIN_ACCESS_GROUP_ID',
      'DEFAULT_USER_COH_USER_1_USERNAME',
      'DEFAULT_USER_COH_USER_1_PASSWORD',
      'DEFAULT_USER_COH_USER_1_ACCESS_GROUP_ID',
      'DEFAULT_USER_COH_USER_2_USERNAME',
      'DEFAULT_USER_COH_USER_2_PASSWORD',
      'DEFAULT_USER_COH_USER_2_ACCESS_GROUP_ID',
      'ENCRYPTION_KEY',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('APP_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}
