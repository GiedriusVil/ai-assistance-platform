/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-conversations-channels';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { conversationsService } = require('@ibm-aca/aca-conversations-service');

const channels = async (request, response) => {
  const ERRORS = [];

  const KEY = request?.body?.key;
  if (lodash.isEmpty(KEY)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing KEY!',
    });
  }

  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        key: KEY,
      };

      retVal = await conversationsService.channels(CONTEXT, PARAMS);
    }
  } catch(error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(`${channels.name}`, { errors: ERRORS });
    response.status(500).json(ERRORS);
  }
};

module.exports = {
  channels,
};
