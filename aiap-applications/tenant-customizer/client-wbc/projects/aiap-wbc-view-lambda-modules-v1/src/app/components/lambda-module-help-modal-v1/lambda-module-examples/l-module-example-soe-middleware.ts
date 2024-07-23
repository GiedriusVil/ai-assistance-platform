/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
export const L_MODULE_EXAMPLE_SOE_MIDDLEWARE = `
#### SOE Middleware
\`\`\`javascript
const MODULE_ID = 'soe-middleware-test';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const { formatIntoAcaError } = require('@ibm-aca/aca-error-utils');

const execute = async (context, params) => {
   try {

      // Middleware content...

   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
   }
}

module.exports = {
   execute,
};
\`\`\`
`;
