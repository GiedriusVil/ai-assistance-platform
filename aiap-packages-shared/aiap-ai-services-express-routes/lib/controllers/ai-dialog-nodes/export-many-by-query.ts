/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-dialogs-nodes-export-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const json2csv = require('json2csv').Parser;

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
  aiDialogNodesService,
} from '@ibm-aiap/aiap-ai-services-service';

export const exportManyByQuery = async (
  request,
  response
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;

  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(request?.query?.aiServiceId)
    ) {
      const MESSAGE = `Missing required request.query.aiServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(request?.query?.aiSkillId)
    ) {
      const MESSAGE = `Missing required request.query.aiSkillId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DIALOG_NODES = await aiDialogNodesService.retrieveManyByQueryFlattenByTexts(CONTEXT,
      {
        query: {
          filter: {
            aiServiceId: request?.query?.aiServiceId,
            aiSkillId: request?.query?.aiSkillId,
          }
        }
      });

    const CSV_FIELDS = [
      'dialog_node',
      'title',
      'parent',
      'conditions',
      'type',
      'createdDate',
      'createdTime',
      'updatedDate',
      'updatedTime',
      'text',
    ];
    const OPTS = {
      fields: CSV_FIELDS
    };
    const PARSER = new json2csv(OPTS);
    result = PARSER.parse(DIALOG_NODES);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.setHeader('Content-disposition', 'attachment; filename=Dialogs_' + currentDateAsString() + '.csv');
    response.set('Content-Type', 'text/csv');
    response.status(200).send(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
