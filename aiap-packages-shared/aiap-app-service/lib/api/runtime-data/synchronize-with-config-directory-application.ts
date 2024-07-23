/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-runtime-data-service-synchronize-with-config-directory-application';
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
  IApplicationV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from '../../configuration';

export const synchronizeWithConfigDirectoryApplication = async (
  context: IContextV1,
  params: {
    value: IApplicationV1,
  },
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
      if (
        lodash.isEmpty(params?.value?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter params?.value?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      const FILE_PATH = `${configAbsolutePath}/runtime-data-local/portal/applications/${params?.value?.id}.json`;
      fsExtra.writeFileSync(
        FILE_PATH,
        JSON.stringify(params?.value, null, 4)
      );
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      AIAP_DIR_CONFIG,
      configAbsolutePath,
      configurationLocalSyncEnabled,
    });
    logger.error(synchronizeWithConfigDirectoryApplication.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
