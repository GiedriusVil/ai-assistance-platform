/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-service-runtime-data-delete-many-by-keys-from-config-directory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import path from 'path';
import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getLibConfiguration } from '../../configuration';

const deleteManyByKeysFromConfigDirectory = async (context, params) => {
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

      const DIR_ENGAGEMENTS = `${configAbsolutePath}/runtime-data-local/policy-manager/${context?.user?.session?.tenant?.id}/engagements`;
      fsExtra.ensureDirSync(DIR_ENGAGEMENTS);

      if (
        !lodash.isEmpty(params?.keys) &&
        lodash.isArray(params?.keys)
      ) {
        const FILES = fsExtra.readdirSync(DIR_ENGAGEMENTS);
        for (const FILE of FILES) {
          if (!FILE.endsWith('.json')) continue;
          
          const ENGAGEMENT = fsExtra.readJsonSync(`${DIR_ENGAGEMENTS}/${FILE}`);
          if (params.keys.includes(ENGAGEMENT.key)) {
            fsExtra.removeSync(
              `${DIR_ENGAGEMENTS}/${FILE}`
            );
            fsExtra.removeSync(
              `${DIR_ENGAGEMENTS}/${ENGAGEMENT.id}.js`
            )
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
    logger.error(deleteManyByKeysFromConfigDirectory.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteManyByKeysFromConfigDirectory,
}
