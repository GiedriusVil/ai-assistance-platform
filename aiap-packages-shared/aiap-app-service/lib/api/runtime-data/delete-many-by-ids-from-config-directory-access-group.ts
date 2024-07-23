/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-runtime-data-service-delete-many-by-ids-from-config-directory-access-group';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const path = require('path');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from '../../configuration';

export const deleteManyByIdsFromConfigDirectoryAccessGroup = async (
  context: IContextV1,
  params: {
    ids: Array<any>,
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
      configAbsolutePath = path.resolve(__dirname, `../../../../../${AIAP_DIR_CONFIG}`);
      if (
        !fsExtra.existsSync(configAbsolutePath)
      ) {
        const ERROR_MESSAGE = `Missing configuration repository!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        !lodash.isEmpty(params?.ids) &&
        lodash.isArray(params?.ids)
      ) {
        for (const TMP_ID of params.ids) {
          if (
            !lodash.isEmpty(TMP_ID)
          ) {
            const FILE_PATH = `${configAbsolutePath}/runtime-data-local/portal/access-groups/${TMP_ID}.json`;
            fsExtra.removeSync(FILE_PATH);
          }
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      AIAP_DIR_CONFIG,
      configAbsolutePath,
      configurationLocalSyncEnabled,
    });
    logger.error(deleteManyByIdsFromConfigDirectoryAccessGroup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
