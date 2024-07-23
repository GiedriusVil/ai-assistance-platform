/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-runtime-data-service-synchronize-with-database-access-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

const synchronizeWithDatabaseAccessGroup = async (
  context: IContextV1,
  params: {
    accessGroupConfigAbsolutePath: any,
  },
) => {
  let retVal;
  let accessGroup;
  try {
    if (
      lodash.isEmpty(params?.accessGroupConfigAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.accessGroupConfigAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    accessGroup = fsExtra.readJSONSync(params?.accessGroupConfigAbsolutePath);
    if (
      lodash.isEmpty(accessGroup?.id)
    ) {
      const ERROR_MESSAGE = `Missing required attribute accessGroup?.id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    const DATASOURCE = getDatasourceV1App();
    retVal = await DATASOURCE.accessGroups.saveOne(context, { value: accessGroup });

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(synchronizeWithDatabaseAccessGroup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
  return retVal;
}

export const synchronizeWithDatabaseAccessGroups = async (
  context: IContextV1,
  params: {
    configAbsolutePath: any,
  },
) => {
  let configAbsolutePathAccessGroups;
  let directory;
  const RET_VAL: Array<any> = [];
  try {
    if (
      lodash.isEmpty(params?.configAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configAbsolutePathAccessGroups = `${params?.configAbsolutePath}/runtime-data-local/portal/access-groups`;
    fsExtra.ensureDirSync(configAbsolutePathAccessGroups);
    directory = fsExtra.readdirSync(configAbsolutePathAccessGroups);
    if (
      !lodash.isEmpty(directory) &&
      lodash.isArray(directory)
    ) {
      const PROMISES = [];
      for (const ACCESS_GROUP_CONFIG_FILE of directory) {
        if (
          !lodash.isEmpty(ACCESS_GROUP_CONFIG_FILE) &&
          ACCESS_GROUP_CONFIG_FILE.endsWith('.json')
        ) {
          PROMISES.push(synchronizeWithDatabaseAccessGroup(context, {
            accessGroupConfigAbsolutePath: `${configAbsolutePathAccessGroups}/${ACCESS_GROUP_CONFIG_FILE}`
          }));
        }
      }
      const ACCESS_GROUPS = await Promise.all(PROMISES);
      if (
        !lodash.isEmpty(ACCESS_GROUPS) &&
        lodash.isArray(ACCESS_GROUPS)
      ) {
        for (const ACCESS_GROUP of ACCESS_GROUPS) {
          if (
            !lodash.isEmpty(ACCESS_GROUP?.id)
          ) {
            RET_VAL.push(ACCESS_GROUP?.id);
          }
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseAccessGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
