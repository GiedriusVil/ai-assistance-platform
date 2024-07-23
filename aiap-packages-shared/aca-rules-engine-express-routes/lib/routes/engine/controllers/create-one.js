/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-express-routes-controller-engine-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const engineService = require('@ibm-aca/aca-rules-engine-provider');

const createEngineInstance = async (req, res) => {
  const ERRORS = [];

  const REQUEST_BODY = ramda.path(['body'], req);
  const CLIENT_ID = ramda.path(['clientId'], REQUEST_BODY);

  let result;
  try {
    if (lodash.isEmpty(ERRORS)) {
      result = await engineService.initiNewAcaRulesEngineByOrg(CLIENT_ID);
    }
  } catch (err) {
    ERRORS.push({
      error: err, 
      message: `Cought error while calling engineService: ${err}`
    });
  }

  if (lodash.isEmpty(ERRORS)) {
    logger.info(`Engine Instance for clieant - '${CLIENT_ID}' created!`)
    res.status(200).json(result);
  } else {
    logger.error('ERROR', ERRORS);
    res.status(500).json({});
  }
};


module.exports = {
  createEngineInstance,
};
