/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-app-demo-express-routes-controllers-demo-render-general-page-demo`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getAcaAppBuildTimestamp } = require('@ibm-aca/aca-utils-metadata');
const { retrieveEngagements, retrieveEnvironmentsByEngagements } = require('../../utils/engagements.utils');
const { getConfiguration } = require('../../configuration');


const renderPageDemo = async (request, response) => {
  const ERRORS = [];

  const TENANT_ID = request?.query?.tenantId;
  const ASSISTANT_ID = request?.query?.assistantId;
  const ENGAGEMENT_ID = ramda.pathOr('default', ['query', 'engagementId'], request);
  const LANGUAGE = ramda.pathOr('fi', ['query', 'language'], request);
  const HOST = `${request?.protocol}://${request?.headers?.host}`;

  let acaAppBuildTimestamp;
  let engagements;
  let environments;
  let jsPathWidgetButton;
  let userProfileMockEnabled;

  const RENDER_OPTIONS = {};
  try {
    acaAppBuildTimestamp = getAcaAppBuildTimestamp();
    engagements = await retrieveEngagements();
    environments = retrieveEnvironmentsByEngagements(engagements);
    userProfileMockEnabled = getConfiguration()?.chatAppDemoExpressRoutes?.userProfileMockEnabled;

    if (
      TENANT_ID &&
      ASSISTANT_ID &&
      ENGAGEMENT_ID
    ) {
      jsPathWidgetButton = `${HOST}/get-widget-button?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
    }

    RENDER_OPTIONS.acaAppBuildTimestamp = acaAppBuildTimestamp;
    RENDER_OPTIONS.engagementId = ENGAGEMENT_ID;
    RENDER_OPTIONS.language = LANGUAGE;
    RENDER_OPTIONS.tenantId = TENANT_ID;
    RENDER_OPTIONS.assistantId = ASSISTANT_ID;
    RENDER_OPTIONS.engagements = JSON.stringify(engagements);
    RENDER_OPTIONS.environments = JSON.stringify(environments);
    RENDER_OPTIONS.jsPathWidgetButton = jsPathWidgetButton;
    RENDER_OPTIONS.userProfileMockEnabled = userProfileMockEnabled;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { TENANT_ID, ASSISTANT_ID, ENGAGEMENT_ID, LANGUAGE });
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error(renderPageDemo.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  } else {
    logger.info('RENDER_OPTIONS', { RENDER_OPTIONS });
    response.render('demo', RENDER_OPTIONS);
  }
};

module.exports = {
  renderPageDemo,
};
