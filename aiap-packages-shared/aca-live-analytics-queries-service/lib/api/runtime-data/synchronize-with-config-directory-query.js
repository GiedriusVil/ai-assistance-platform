/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-service-runtime-data-service-synchronize-with-config-directory-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const path = require('path');
const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { decodeObjectBase64Attribute } = require('@ibm-aca/aca-utils-codec');

const { getLibConfiguration } = require('../../configuration');

const synchronizeWithConfigDirectoryQuery = async (context, params) => {
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
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      if (
        lodash.isEmpty(params?.value?.ref)
      ) {
        const ERROR_MESSAGE = `Missing required parameter params?.value?.ref!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }

      const DIR_L_MODULES = `${configAbsolutePath}/runtime-data-local/live-analytics/${context?.user?.session?.tenant?.id}/queries`;
      fsExtra.ensureDirSync(DIR_L_MODULES);

      const TMP_VALUE = lodash.cloneDeep(params?.value);
      if (
        !lodash.isEmpty(TMP_VALUE?.code) &&
        lodash.isString(TMP_VALUE?.code)
      ) {
        decodeObjectBase64Attribute(TMP_VALUE, 'code');
        fsExtra.writeFileSync(
          `${DIR_L_MODULES}/${params?.value?.ref}.js`,
          TMP_VALUE?.code
        );
        delete TMP_VALUE?.code;
      }

      fsExtra.writeFileSync(
        `${DIR_L_MODULES}/${params?.value?.ref}.json`,
        JSON.stringify(TMP_VALUE, null, 4)
      );


    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      configurationLocalSyncEnabled,
      AIAP_DIR_CONFIG,
      configAbsolutePath,
    });
    logger.error(synchronizeWithConfigDirectoryQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithConfigDirectoryQuery,
}
