/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-datasource-provider-datasource-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaOauth2DatasourceMongo } = require('../datasource-mongo');

const _createMongoDatasource = async (configuration) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new AcaOauth2DatasourceMongo(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_createMongoDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAcaOauth2Datasource = async (configuration) => {
  try {
    // 2021-12-17 [LEGO] - We will have to think about client type here!
    const RET_VAL = await _createMongoDatasource(configuration);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAcaOauth2Datasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAcaOauth2Datasources = async (configurations) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const ERROR_MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { configurations });
    }
    const PROMISES = configurations.map((configuration) => {
      return createAcaOauth2Datasource(configuration);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAcaOauth2Datasources.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  createAcaOauth2Datasource,
  createAcaOauth2Datasources,
}
