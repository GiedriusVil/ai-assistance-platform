/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-adapter-slack-lib-utils-construct-gAcaProps';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getTenantHashFromId } = require('./getTenantHashFromId');

const constructGAcaProps = async (params) => {
  try {
    const ASSISTANT_ID = ramda.path(['settings', 'assistant'], params);
    const TENANT_ID = ramda.path(['settings', 'tenantId'], params);
    const TENANT_HASH = await getTenantHashFromId(TENANT_ID);
    const USER_EMAIL = ramda.path(['slackUserData', 'email'], params);
    const FIRST_NAME = ramda.path(['slackUserData', 'firstName'], params);
    const LAST_NAME = ramda.path(['slackUserData', 'lastName'], params);
    const RET_VAL = {
      assistantId: ASSISTANT_ID,
      displayName: 'BUY@IBM Assistant',
      isoLang: 'en',
      tenantId: TENANT_ID,
      tenantHash: TENANT_HASH,
      user: {
        email: USER_EMAIL,
        firstName: FIRST_NAME,
        lastName: LAST_NAME,
        country: {
          isoCode: 'eng'
        }
      }
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  constructGAcaProps,
};
