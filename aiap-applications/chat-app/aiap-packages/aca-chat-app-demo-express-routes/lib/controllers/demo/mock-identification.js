/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-demo-endpoints-express-routes-controllers-demo-mock-identification';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const mockIdentification = (request, response) => {
  const RENDER_OPTIONS = {};
  logger.info('RENDER_OPTIONS', { RENDER_OPTIONS });
  response.render('mock-identification', RENDER_OPTIONS);
};

module.exports = {
  mockIdentification,
};
