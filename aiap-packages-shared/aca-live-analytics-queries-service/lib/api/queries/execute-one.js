/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-execute-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { executeEnrichedByQuery } = require('@ibm-aca/aca-live-analytics-queries-executor');
const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const _retrieveData = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'retrieveData() function is not implemented. Please implement it using Query configurator.',
    { params }
  );
}

const _exportData = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'exportData() function is not implemented. Please implement it using Query configurator.',
    { params }
  );
}

const _aggregations = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'aggregations() function is not implemented. Please implement it using Query configurator.',
    { params }
  );
}

const _transformResults = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'transformResults() function is not implemented. Please implement it using Query configurator.',
    { params }
  );
}

const ORIGIN = {
  _retrieveData: _retrieveData,
  _exportData: _exportData,
  _aggregations: _aggregations,
  _transformResults: _transformResults,
};

const executeOne = async (context, params) => {
  try {
    const QUERY_REF = params?.ref;
    if (lodash.isEmpty(QUERY_REF)) {
      const ERROR_MESSAGE = `Missing required value params.ref`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }
    const RET_VAL = await executeEnrichedByQuery(QUERY_REF, ORIGIN, context, params);
    return RET_VAL;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(executeOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  executeOne,
}
