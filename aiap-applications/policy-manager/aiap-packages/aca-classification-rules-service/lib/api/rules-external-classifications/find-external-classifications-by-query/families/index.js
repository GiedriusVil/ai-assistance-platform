/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-classification-rules-classifications-external-families-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { formatResponse } = require('./format-response');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findManyFamiliesByQuery = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const TMP_FAMILIES = require('../../../../../data/families-response.json');

  let segmentId;
  try {
 
    segmentId = params?.segmentId;

    if(lodash.isEmpty(segmentId)) {
      const MESSAGE = 'Missing required params.segmentId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const FAMILIES = ramda.pathOr([], ['items'], TMP_FAMILIES)
      .filter(res => res.segmentId === segmentId);
    const TOTAL = ramda.pathOr(FAMILIES.length, ['total'], TMP_FAMILIES);

    const RET_VAL = {
      items: formatResponse(FAMILIES),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, segmentId });
    logger.error(`${_findManyFamiliesByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManyFamiliesByQuery = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findManyFamiliesByQuery, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${findManyFamiliesByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyFamiliesByQuery,
}
