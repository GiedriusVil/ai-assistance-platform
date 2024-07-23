/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-classification-rules-classifications-external-commodities-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { formatResponse } = require('./format-response');


const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findManyCommoditiesByQuery = async (context, params) => {
  const CONTEXT_UESR_ID = context?.user?.id;
  const TMP_COMMODITIES = require('../../../../../data/commodities-response.json');

  let segmentId;
  let familyId;
  let classId;
  try {
 
    segmentId = params?.segmentId;
    familyId = params?.familyId;
    classId = params?.classId;

    if(lodash.isEmpty(segmentId)) {
      const MESSAGE = 'Missing required params.segmentId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if(lodash.isEmpty(familyId)) {
      const MESSAGE = 'Missing required params.familyId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if(lodash.isEmpty(classId)) {
      const MESSAGE = 'Missing required params.classId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const COMMODITIES = ramda.pathOr([], ['items'], TMP_COMMODITIES)
      .filter(res => res.segmentId === segmentId &&
        res.familyId === familyId &&
        res.classId === classId
      );
    const TOTAL = ramda.pathOr(COMMODITIES.length, ['total'], TMP_COMMODITIES);

    const RET_VAL = {
      items: formatResponse(COMMODITIES),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_UESR_ID, segmentId, familyId, classId })
    logger.error(`${_findManyCommoditiesByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManyCommoditiesByQuery = async (context, params) => {
  const CONTEXT_UESR_ID = context?.user?.id;
  try {
      const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findManyCommoditiesByQuery, context, params);
      return RET_VAL;
  } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { CONTEXT_UESR_ID })
      logger.error(`${findManyCommoditiesByQuery.name}`, { ACA_ERROR });
      throw ACA_ERROR;
  }
};

module.exports = {
  findManyCommoditiesByQuery,
}
