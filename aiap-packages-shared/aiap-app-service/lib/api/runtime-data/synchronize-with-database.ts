/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-runtime-data-service-synchronize-with-database';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const path = require('path');

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
  getLibConfiguration,
} from '../../configuration';

import { synchronizeWithDatabaseApplications } from './synchronize-with-database-applications';
import { synchronizeWithDatabaseTenants } from './synchronize-with-database-tenants';
import { synchronizeWithDatabaseAccessGroups } from './synchronize-with-database-access-groups';

export const synchronizeWithDatabase = async (
  context: IContextV1,
  params: any,
) => {
  const AIAP_DIR_CONFIG = process?.env?.AIAP_DIR_CONFIG;

  let configurationLocalSyncEnabled = false;
  let configAbsolutePath;
  try {
    configurationLocalSyncEnabled = getLibConfiguration().configurationLocalSyncEnabled;
    if (
      !lodash.isEmpty(AIAP_DIR_CONFIG) &&
      configurationLocalSyncEnabled
    ) {
      configAbsolutePath = path.resolve(__dirname, `../../../../../../${AIAP_DIR_CONFIG}`);

      if (
        !fsExtra.existsSync(configAbsolutePath)
      ) {
        const ERROR_MESSAGE = `Missing configuration repository!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      const PARAMS = { configAbsolutePath };

      const APPLICATION_IDS = await synchronizeWithDatabaseApplications(context, PARAMS);
      const TENANT_IDS = await synchronizeWithDatabaseTenants(context, PARAMS);
      const ACCESS_GROUP_IDS = await synchronizeWithDatabaseAccessGroups(context, PARAMS);

      logger.info(`Portal Applications synchronized [QTY.: ${APPLICATION_IDS.length}]`);
      logger.info(`Portal Tenants synchronized [QTY.: ${TENANT_IDS.length}]`);
      logger.info(`Portal AccessGroups synchronized [QTY.: ${ACCESS_GROUP_IDS.length}]`);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      configurationLocalSyncEnabled,
      AIAP_DIR_CONFIG,
      configAbsolutePath,
    });
    logger.error(synchronizeWithDatabase.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
