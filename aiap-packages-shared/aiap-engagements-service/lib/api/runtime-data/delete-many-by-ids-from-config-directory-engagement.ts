/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-runtime-data-service-delete-many-from-ids-from-config-directory-engagement';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import path from 'node:path';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  getLibConfiguration,
} from '../../configuration';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

export const deleteManyByIdsFromDirectoryEngagement = async (
  context: IContextV1,
  params: {
    ids: Array<any>
  }
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
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      const DIR_ENGAGEMENTS = `${configAbsolutePath}/runtime-data-local/tenant-customizer/${context?.user?.session?.tenant?.id}/engagements`;
      fsExtra.ensureDirSync(DIR_ENGAGEMENTS);
      if (
        !lodash.isEmpty(params?.ids) &&
        lodash.isArray(params?.ids)
      ) {
        for (const tmpId of params.ids) {
          if (
            !lodash.isEmpty(tmpId)
          ) {
            fsExtra.removeSync(`${DIR_ENGAGEMENTS}/${tmpId}.json`);
            fsExtra.removeSync(`${DIR_ENGAGEMENTS}/${tmpId}.css`);
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
    logger.error(deleteManyByIdsFromDirectoryEngagement.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
