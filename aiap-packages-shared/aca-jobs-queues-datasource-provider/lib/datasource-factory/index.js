/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-datasource-provider-datasource-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');


const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaJobsQueuesDatasourceMongo } = require('../datasource-mongo');

const _createMongoDatasource = async (configuration) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new AcaJobsQueuesDatasourceMongo(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_createMongoDatasource', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAcaJobsQueuesDatasource = async (configuration) => {
  try {
    // 2021-12-17 [LEGO] - We will have to thing about client type here!
    const RET_VAL = await _createMongoDatasource(configuration)
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('createAcaJobsQueuesDatasource', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAcaJobsQueuesDatasources = async (configurations) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
    }
    const PROMISES = configurations.map((configuration) => {
      return createAcaJobsQueuesDatasource(configuration);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('createAcaJobsQueuesDatasources', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  createAcaJobsQueuesDatasource,
  createAcaJobsQueuesDatasources,
}
