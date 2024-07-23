/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-gw-validation-express-routes-validate-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validateMany = async (request, response) => {
  response.status(500).json({ status: 'SOON-WILL-BE-AVAILABLE' });
};

module.exports = {
  validateMany
};
