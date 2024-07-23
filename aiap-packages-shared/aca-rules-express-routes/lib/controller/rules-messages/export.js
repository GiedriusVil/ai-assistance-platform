/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-controller-rules-messages-export';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { messagesToXls } = require('@ibm-aiap/aiap-utils-xlsx');
const { rulesMessagesService } = require('@ibm-aca/aca-rules-service');


const exportMessages = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      sort: {
        field: 'id',
        direction: 'asc'
      }
    };
    const messages = await rulesMessagesService.findManyByQuery(CONTEXT, PARAMS);
    const MESSAGE_ITEMS = ramda.path(['items'], messages);

    result = await messagesToXls(MESSAGE_ITEMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=MessagesExport.xlsx'
    })
    response.end(result);
  } else {
    logger.error('ERROR', ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  exportMessages,
};
