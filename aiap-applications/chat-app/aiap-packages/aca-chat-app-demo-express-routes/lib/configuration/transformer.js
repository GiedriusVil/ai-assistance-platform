/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-app-demo-express-routes-configuration-transformer`;

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _engagementsFilter = (rawConfiguration, provider) => {
  try {
    const ENGAGEMENTS_FILTER_RAW = rawConfiguration.CHAT_APP_DEMO_EXPRESS_ROUTES_ENGAGEMENTS_FILTER;
    const RET_VAL = JSON.parse(ENGAGEMENTS_FILTER_RAW);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('CHAT_APP_DEMO_EXPRESS_ROUTES_ENABLED', false, {
    engagementsFilter: _engagementsFilter(rawConfiguration, provider),
    userProfileMockEnabled: rawConfiguration.CHAT_APP_DEMO_EXPRESS_ROUTES_USER_PROFILE_MOCK_ENABLED || false,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
