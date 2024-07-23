/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-classification-rules-classifications-external-segments-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { formatResponse } = require('./format-response');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findManySegmentsByQuery = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const TMP_SEGMENTS = require('../../../../../data/segments-response.json');
  try {
    const SEGMENTS = ramda.pathOr([], ['items'], TMP_SEGMENTS);
    const TOTAL = ramda.pathOr(SEGMENTS.length, ['total'], TMP_SEGMENTS);
    const RET_VAL = {
      items: formatResponse(SEGMENTS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID })
    logger.error(`${_findManySegmentsByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManySegmentsByQuery = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
      const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findManySegmentsByQuery, context, params);
      return RET_VAL;
  } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
      logger.error(`${findManySegmentsByQuery.name}`, { ACA_ERROR });
      throw ACA_ERROR;
  }
};

module.exports = {
  findManySegmentsByQuery,
}
