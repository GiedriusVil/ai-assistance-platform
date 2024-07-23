/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-classification-rules-classifications-external-classes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { formatResponse } = require('./format-response');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findManyClassesByQuery = async (context, params) => {
  const CONTEXT_UESR_ID = context?.user?.id;
  const TMP_CLASSES = require('../../../../../data/classes-response.json');

  let segmentId;
  let familyId;
  try {
    segmentId = params?.segmentId;
    familyId = params?.familyId;

    if(lodash.isEmpty(segmentId)) {
      const MESSAGE = 'Missing required params.segmentId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if(lodash.isEmpty(familyId)) {
      const MESSAGE = 'Missing required params.familyId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const CLASSES = ramda.pathOr([], ['items'], TMP_CLASSES)
      .filter(res => res.segmentId === segmentId &&
        res.familyId === familyId
      );
    const TOTAL = ramda.pathOr(CLASSES.length, ['total'], TMP_CLASSES);

    const RET_VAL = {
      items: formatResponse(CLASSES),
      total: TOTAL
    };
    
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_UESR_ID, segmentId, familyId })
    logger.error(`${_findManyClassesByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManyClassesByQuery = async (context, params) => {
  const CONTEXT_UESR_ID = context?.user?.id;  
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findManyClassesByQuery, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_UESR_ID });
    logger.error(`${findManyClassesByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyClassesByQuery,
}
