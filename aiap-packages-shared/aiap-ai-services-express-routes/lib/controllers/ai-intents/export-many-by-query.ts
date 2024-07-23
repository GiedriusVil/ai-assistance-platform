/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-express-routes-ai-intents-export-intents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const json2csv = require('json2csv').Parser;

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  currentDateAsString,
} from '@ibm-aiap/aiap-utils-date';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

// import {
//   aiIntentsService,
// } from '@ibm-aiap/aiap-ai-services-service';

export const exportManyByQuery = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER = ramda.path(['user'], CONTEXT);
  const USER_ID = ramda.path(['id'], USER);
  const AI_SERVICE_ID = ramda.path(['query', 'aiServiceId'], request);
  const AI_SKILL_ID = ramda.path(['query', 'aiSkillId'], request);
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(AI_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.query.aiServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SKILL_ID)
    ) {
      const MESSAGE = `Missing required request.query.aiSkillId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      aiServiceId: AI_SERVICE_ID,
      aiSkillId: AI_SKILL_ID,
    }
    throw new Error('Missing implementation!');
    // const FLATTEN_INTENTS = await aiIntentsService.retrieveFlattenIntentsAndExamples(CONTEXT, PARAMS);
    // const CSV_FIELDS = [
    //   'intent',
    //   'example',
    //   'createdDate',
    //   'createdTime',
    //   'updatedDate',
    //   'updatedTime'
    // ];
    // const OPTS = {
    //   fields: CSV_FIELDS
    // };
    // const PARSER = new json2csv(OPTS);
    // result = PARSER.parse(FLATTEN_INTENTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_SERVICE_ID, AI_SKILL_ID });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.setHeader('Content-disposition', 'attachment; filename=Intents_' + currentDateAsString() + '.csv');
    response.set('Content-Type', 'text/csv');
    response.status(200).send(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
