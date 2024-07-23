/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-demo-endpoints-express-routes-controllers-demo-redirect-to-url';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const redirectToUrl = (request, response) => {
  const ERRORS = [];
  const TARGET_URL = ramda.path(['query', 'target'], request);
  if (!lodash.isEmpty(TARGET_URL)) {
    response.redirect(TARGET_URL);
  } else {
    ERRORS.push({ error: 'INVALID TARGET_URL' });
    logger.info('->', ERRORS);
    response.status(500).json(ERRORS);
  }
};

module.exports = {
  redirectToUrl,
};
