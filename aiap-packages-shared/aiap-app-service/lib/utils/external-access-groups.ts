/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-external-access-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findManyByQuery,
} from '../api/access-groups/find-many-by-query';

import {
  updateOne,
} from '../api/users/update-one';

const _getExternalAccessGroupIds = async (
  context: IContextV1,
  params: any,
) => {
  const RET_VAL = [];
  try {
    const AUTH_EXTERNAL_ACCESS_GROUP = _decodeExternalAccessGroups(params?.externalAccessGroups);

    const ACCESS_GROUPS = await findManyByQuery(
      context,
      {
        query: {
          pagination: {
            page: 0,
            size: 999999
          }
        }
      });

    const ACCESS_GROUPS_ITEMS = ACCESS_GROUPS?.items;

    if (lodash.isArray(ACCESS_GROUPS_ITEMS) && lodash.isArray(AUTH_EXTERNAL_ACCESS_GROUP)) {
      AUTH_EXTERNAL_ACCESS_GROUP.forEach(externalAccessGroup => {
        ACCESS_GROUPS_ITEMS.forEach(accessGroup => {
          const ID = accessGroup?.id;
          const EXTERNAL_ID = accessGroup?.externalId;

          if (lodash.isEqual(externalAccessGroup, EXTERNAL_ID)) {
            const FOUND_EXTERNAL_ACCESS_GROUP = RET_VAL.find(el => lodash.isEqual(el.externalAccessGroup, externalAccessGroup));

            if (lodash.isEmpty(FOUND_EXTERNAL_ACCESS_GROUP)) {
              const EXTERNAL_ACCESS_GROUP = {
                externalAccessGroup: externalAccessGroup,
                accessGroupIds: [ID],
              };
              RET_VAL.push(EXTERNAL_ACCESS_GROUP);
            } else {
              FOUND_EXTERNAL_ACCESS_GROUP.accessGroupIds.push(ID);
            }
          }
        });
      });
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_getExternalAccessGroupIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _assignNonAssignedGroups = (
  user,
  externalAccessGroupMappings,
) => {
  if (
    !lodash.isEmpty(user) &&
    lodash.isArray(externalAccessGroupMappings)
  ) {
    externalAccessGroupMappings.forEach(externalAccessGroupMapping => {
      const ACCESS_GROUP_IDS = externalAccessGroupMapping?.accessGroupIds || [];

      const USER_ACCESS_GROUP_IDS = user?.accessGroupIds || [];
      const NON_ASSIGNED_EXTERNAL_ACCESS_GROUP = ACCESS_GROUP_IDS.find(id => !USER_ACCESS_GROUP_IDS.includes(id));
      if (NON_ASSIGNED_EXTERNAL_ACCESS_GROUP) {
        const MERGED_ACCESS_GROUP_IDS = [...USER_ACCESS_GROUP_IDS, ...ACCESS_GROUP_IDS];
        const UNIQUE_ACCESS_GROUP_IDS = [...new Set(MERGED_ACCESS_GROUP_IDS)];

        const USER_EXTERNAL_ACCESS_GROUPS = user?.externalAccessGroups || [];
        const MERGED_EXTERNAL_ACCESS_GROUPS = [...USER_EXTERNAL_ACCESS_GROUPS, externalAccessGroupMapping?.externalAccessGroup];
        const UNIQUE_EXTERNAL_ACCESS_GROUPS = [...new Set(MERGED_EXTERNAL_ACCESS_GROUPS)];

        user.accessGroupIds = UNIQUE_ACCESS_GROUP_IDS;
        user.externalAccessGroups = UNIQUE_EXTERNAL_ACCESS_GROUPS;
      }
    });
  }
}

const _removeNonAssignedGroups = (
  user,
  externalAccessGroupMappings,
) => {
  if (
    !lodash.isEmpty(user) &&
    lodash.isArray(externalAccessGroupMappings)
  ) {
    const USER_ACCESS_GROUP_IDS = user?.accessGroupIds;
    const USER_EXTERNAL_ACCESS_GROUPS = user?.externalAccessGroups;

    if (
      lodash.isArray(USER_ACCESS_GROUP_IDS) &&
      lodash.isArray(USER_EXTERNAL_ACCESS_GROUPS)
    ) {
      const AUTHORIZATION_EXTERNAL_ACCESS_GROUPS = externalAccessGroupMappings.map(el => el.externalAccessGroup);

      USER_EXTERNAL_ACCESS_GROUPS.forEach(userExternalAccessGroup => {
        if (!AUTHORIZATION_EXTERNAL_ACCESS_GROUPS.includes(userExternalAccessGroup)) {
          const EXTERNAL_ACCESS_GROUP = externalAccessGroupMappings.find(el => lodash.isEqual(el.externalAccessGroup, userExternalAccessGroup));
          const EXTERNAL_ACCESS_GROUP_IDS = EXTERNAL_ACCESS_GROUP?.accessGroupIds;

          if (lodash.isArray(EXTERNAL_ACCESS_GROUP_IDS)) {
            EXTERNAL_ACCESS_GROUP_IDS.forEach(accessGroupId => {
              const ACCESS_GROUP_ID_INDEX = lodash.indexOf(USER_ACCESS_GROUP_IDS, accessGroupId);
              if (ACCESS_GROUP_ID_INDEX >= 0) {
                USER_ACCESS_GROUP_IDS.splice(ACCESS_GROUP_ID_INDEX, 1);
              }

              const EXTERNAL_ACCESS_GROUP_INDEX = lodash.indexOf(USER_EXTERNAL_ACCESS_GROUPS, userExternalAccessGroup);
              if (EXTERNAL_ACCESS_GROUP_INDEX >= 0) {
                USER_EXTERNAL_ACCESS_GROUPS.splice(EXTERNAL_ACCESS_GROUP_INDEX, 1);
              }
            });
          }
        }
      });
    }
  }
}

const _decodeExternalAccessGroups = (
  externalAccessGroups: any,
) => {
  const DECODED_EXTERNAL_ACCESS_GROUPS = [];
  if (lodash.isArray(externalAccessGroups)) {
    externalAccessGroups.forEach(accessGroup => {
      const DECODED_EXTERNAL_ACCESS_GROUP = decodeURI(accessGroup);
      DECODED_EXTERNAL_ACCESS_GROUPS.push(DECODED_EXTERNAL_ACCESS_GROUP);
    });
  }
  return DECODED_EXTERNAL_ACCESS_GROUPS;
}

export const assignExternalAccessGroups = async (
  context: IContextV1,
  params: any
) => {
  try {
    const USER = params?.user;
    if (
      lodash.isEmpty(USER)
    ) {
      const MESSAGE = `Missing required params.user parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const EXTERNAL_ACCESS_GROUPS = _decodeExternalAccessGroups(params?.externalAccessGroups);
    logger.info('Retrieved external access groups: ', { EXTERNAL_ACCESS_GROUPS });

    if (
      lodash.isEmpty(EXTERNAL_ACCESS_GROUPS)
    ) {
      const MESSAGE = `Missing required params.externalAccessGroups parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const EXTERNAL_ACCESS_GROUP_MAPPING = await _getExternalAccessGroupIds(context, params);

    _assignNonAssignedGroups(USER, EXTERNAL_ACCESS_GROUP_MAPPING);
    _removeNonAssignedGroups(USER, EXTERNAL_ACCESS_GROUP_MAPPING);

    await updateOne(
      context,
      {
        value: USER,
      }
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(assignExternalAccessGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
