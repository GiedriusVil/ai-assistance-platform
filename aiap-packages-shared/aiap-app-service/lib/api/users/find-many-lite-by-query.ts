/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `app-service-users-find-many-by-access-group-names-lite`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindUsersLiteByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  findManyLiteByQuery as findAccessGroupsLiteByQuery,
} from '../access-groups';

export const findManyLiteByQuery = async (
  context: IContextV1,
  params: IParamsV1FindUsersLiteByQuery,
) => {
  try {
    const QUERY_ACCESS_GROUPS = {
      filter: {
        names: params?.query?.filter?.accessGroupsNames,
      },
      pagination: {
        page: 1,
        size: 999999,
      },
    };
    const ACCESS_GROUPS = await findAccessGroupsLiteByQuery(
      context,
      {
        query: QUERY_ACCESS_GROUPS,
      }
    );
    const ACCESS_GROUPS_IDS = ACCESS_GROUPS.items.map((group) => group.id);
    const PARAMS: IParamsV1FindUsersLiteByQuery = {
      ...params,
    }
    const DEFAULT_PAGINATION = {
      page: 1,
      size: 999999,
    }
    if (
      !PARAMS?.query
    ) {
      PARAMS.query = {
        pagination: DEFAULT_PAGINATION,
      }
    }
    if (
      !PARAMS?.query?.pagination
    ) {
      PARAMS.query.pagination = DEFAULT_PAGINATION;
    }
    if (
      !lodash.isEmpty(PARAMS?.query?.filter)
    ) {
      PARAMS.query.filter = {};
    }
    PARAMS.query.filter.accessGroupsIds = ACCESS_GROUPS_IDS;
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.users.findManyLiteByQuery(context, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyLiteByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
