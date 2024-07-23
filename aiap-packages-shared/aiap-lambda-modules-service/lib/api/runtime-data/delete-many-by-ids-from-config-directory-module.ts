/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-lambda-modules-service-runtime-data-service-delete-many-by-ids-from-config-directory-module`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { 
  formatIntoAcaError, 
  appendDataToError, 
  throwAcaError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import path from 'path';
import { 
  fsExtra 
} from '@ibm-aca/aca-wrapper-fs-extra';

import { 
  getLibConfiguration 
} from '../../configuration';

const deleteManyByIdsFromConfigDirectoryModule = async (context: IContextV1, params: { ids: any[] }) => {
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
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      const DIR_L_MODULES = `${configAbsolutePath}/runtime-data-local/tenant-customizer/${context?.user?.session?.tenant?.id}/lambda-modules`;
      fsExtra.ensureDirSync(DIR_L_MODULES);
      if (
        !lodash.isEmpty(params?.ids) &&
        lodash.isArray(params?.ids)
      ) {
        for (let tmpId of params.ids) {
          if (
            !lodash.isEmpty(tmpId)
          ) {
            fsExtra.removeSync(`${DIR_L_MODULES}/${tmpId}.js`);
            fsExtra.removeSync(`${DIR_L_MODULES}/${tmpId}.json`);
          }
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      configurationLocalSyncEnabled,
      AIAP_DIR_CONFIG,
      configAbsolutePath,
    });
    logger.error(deleteManyByIdsFromConfigDirectoryModule.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteManyByIdsFromConfigDirectoryModule,
}
