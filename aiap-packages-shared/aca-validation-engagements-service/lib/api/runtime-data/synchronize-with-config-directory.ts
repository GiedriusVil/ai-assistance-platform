/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-service-runtime-data-synchronize-with-config-directory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const path = require('path');
const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getLibConfiguration } = require('../../configuration');

const { decodeObjectBase64Attribute } = require('@ibm-aca/aca-utils-codec');

const synchronizeWithConfigDirectory = async (context, params) => {
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

      if (
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      const DIR_ENGAGEMENTS = `${configAbsolutePath}/runtime-data-local/policy-manager/${context?.user?.session?.tenant?.id}/engagements`;
      fsExtra.ensureDirSync(DIR_ENGAGEMENTS);


      const TMP_VALUE = lodash.cloneDeep(params?.value);
      if (
        !lodash.isEmpty(TMP_VALUE?.schema?.value) &&
        lodash.isString(TMP_VALUE?.schema?.value)
      ) {
        decodeObjectBase64Attribute(TMP_VALUE.schema, 'value');

        fsExtra.writeFileSync(
          `${DIR_ENGAGEMENTS}/${params?.value?.id}.js`,
          TMP_VALUE?.schema?.value
        );
        delete TMP_VALUE.schema.value;
      }
      fsExtra.writeFileSync(
        `${DIR_ENGAGEMENTS}/${params?.value?.id}.json`,
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
    logger.error(synchronizeWithConfigDirectory.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithConfigDirectory,
}
