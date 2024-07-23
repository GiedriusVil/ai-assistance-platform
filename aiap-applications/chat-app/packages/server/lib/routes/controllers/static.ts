/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controller-static';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  getConfiguration
} from '@ibm-aiap/aiap-chat-app-configuration';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  getAcaEngagementsCacheProvider
} from '@ibm-aca/aca-engagements-cache-provider';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

const config = getConfiguration();

const BASE_WIDGET_OPTIONS = {
  startText: 'Start Chat',
  continueText: 'Continue Chat',
  chatAppHost: ramda.pathOr(undefined, ['widget', 'chatAppHost'], config),
  assets: {},
  muted: !1,
  minimized: !1,
  maximized: !1,
  width: 448,
  height: 576,
};

const WBC_CHAT_APP_BASE_WIDGET_OPTIONS = {
  startText: 'Start Chat',
  continueText: 'Continue Chat',
  chatAppHost: ramda.pathOr(undefined, ['widget', 'chatAppHost'], config),
  assets: {},
  muted: !1,
  minimized: !1,
  opened: !1,
  windowSize: {
    height: 600,
    width: 448,
  },
  windowPosition: {
    top: 100,
    left: 100,
  },
  leftPanelOpen: !1,
  leftPanelWidth: 300
};

const WBC_CHAT_APP_V3_BASE_WIDGET_OPTIONS = {
  chatAppHost: ramda.pathOr(undefined, ['widget', 'chatAppHost'], config),
  opened: false,
  windowSize: {
    height: 500,
    width: 448,
  },
  windowPosition: {
    top: 100,
    left: 100,
  },
};

const WBC_CHAT_APP_BUTTON_OPTIONS = {
  show: true,
  chatOpened: false,
};

const getWidgetOptions = async (request, response) => {
  try {
    let widgetOptions;
    const ENGAGEMENT_ID = request?.query?.engagementId;
    const TENANT_ID = request?.query?.tenantId;
    const ASSISTANT_ID = request?.query?.assistantId;

    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.tenantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ASSISTANT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.assistantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.engagementId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: TENANT_ID });
    const ENGAGEMENTS_CACHE_PROVIDER = getAcaEngagementsCacheProvider();
    const ENGAGEMENT = await ENGAGEMENTS_CACHE_PROVIDER.engagements.findOneByIdAndHash({
      id: ENGAGEMENT_ID,
      tenant: TENANT
    });
    const CHAT_APP_VERSION = ramda.pathOr('0.1.0', ['chatApp', 'version'], ENGAGEMENT);
    switch (CHAT_APP_VERSION) {
      case '0.3.0':
        widgetOptions = lodash.cloneDeep(WBC_CHAT_APP_V3_BASE_WIDGET_OPTIONS);
        break;
      case '0.2.0':
        widgetOptions = lodash.cloneDeep(WBC_CHAT_APP_BASE_WIDGET_OPTIONS);
        break;
      case '0.1.0':
        widgetOptions = lodash.cloneDeep(BASE_WIDGET_OPTIONS);
        break;
    }
    widgetOptions.tenantId = TENANT_ID;
    widgetOptions.engagementId = ENGAGEMENT_ID;
    widgetOptions.assistantId = ASSISTANT_ID;

    logger.info('->', { widgetOptions });

    response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    return response
      .status(200)
      .type('js')
      .send('window.acaWidgetOptions=' + JSON.stringify(widgetOptions));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('generalStaticEngagement', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const staticEngagement = async (request, response) => {
  const WIDGET_OPTIONS = lodash.cloneDeep(BASE_WIDGET_OPTIONS);
  const ENGAGEMENT_ID = ramda.path(['params', 'engagement'], request);
  const FILE_NAME = ramda.path(['params', 'fileName'], request);
  const TENANT_ID = ramda.path(['query', 'tenantId'], request);
  const ASSISTANT_ID = ramda.path(['query', 'assistantId'], request);

  if (!lodash.isEmpty(TENANT_ID)) {
    WIDGET_OPTIONS.tenantId = TENANT_ID;
  }
  if (!lodash.isEmpty(ASSISTANT_ID)) {
    WIDGET_OPTIONS.assistantId = ASSISTANT_ID;
  }
  logger.info('->', { WIDGET_OPTIONS });
  if (config.cos) {
    const REDIRECT_URL = `${config.cos.endpoint}/api/v1/files/${ENGAGEMENT_ID}/${FILE_NAME}`;
    return response.status(301).redirect(REDIRECT_URL);
  }
  const fileArr = request.params.fileName.split('.');
  if (fileArr.length > 0) {
    const extension = fileArr[fileArr.length - 1];
    if (extension === 'js') {
      response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      return response
        .status(200)
        .type('js')
        .send('window.acaWidgetOptions=' + JSON.stringify(WIDGET_OPTIONS));
    }
  }
  return response.status(200).send('');
};

const wbcChatAppStaticEngagement = async (request, response) => {
  const WIDGET_OPTIONS = lodash.cloneDeep(WBC_CHAT_APP_BASE_WIDGET_OPTIONS);
  const ENGAGEMENT_ID = ramda.path(['params', 'engagement'], request);
  const FILE_NAME = ramda.path(['params', 'fileName'], request);
  const TENANT_ID = ramda.path(['query', 'tenantId'], request);
  const ASSISTANT_ID = ramda.path(['query', 'assistantId'], request);
  if (!lodash.isEmpty(TENANT_ID)) {
    WIDGET_OPTIONS.tenantId = TENANT_ID;
  }
  if (!lodash.isEmpty(ASSISTANT_ID)) {
    WIDGET_OPTIONS.assistantId = ASSISTANT_ID;
  }
  logger.info('->', { WIDGET_OPTIONS });
  if (config.cos) {
    const REDIRECT_URL = `${config.cos.endpoint}/api/v1/files/${ENGAGEMENT_ID}/${FILE_NAME}`;
    return response.status(301).redirect(REDIRECT_URL);
  }
  const fileArr = request.params.fileName.split('.');
  console.log('WIDGET_OPTIONS: ', WIDGET_OPTIONS);
  if (fileArr.length > 0) {
    const extension = fileArr[fileArr.length - 1];
    if (extension === 'js') {
      response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      return response
        .status(200)
        .type('js')
        .send('window.acaWidgetOptions=' + JSON.stringify(WIDGET_OPTIONS));
    }
  }
  return response.status(200).send('');
}

const wbcChatAppButtonEngagement = async (request, response) => {
  const ERRORS = [];

  let engagementId;
  let tenantId;

  let wbcChatAppButtonOptions;

  try {
    engagementId = request?.body?.engagementId;
    tenantId = request?.body?.tenantId;

    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: tenantId });
    const ENGAGEMENTS_CACHE_PROVIDER = getAcaEngagementsCacheProvider();
    const ENGAGEMENT = await ENGAGEMENTS_CACHE_PROVIDER.engagements.findOneByIdAndHash({
      id: engagementId,
      tenant: TENANT
    });

    wbcChatAppButtonOptions = lodash.cloneDeep(WBC_CHAT_APP_BUTTON_OPTIONS);
    wbcChatAppButtonOptions.tenantHash = TENANT?.hash;
    wbcChatAppButtonOptions.chatAppButton = ENGAGEMENT?.chatAppButton;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    ERRORS.push(ACA_ERROR);
  }

  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(wbcChatAppButtonOptions);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

export default {
  staticEngagement,
  wbcChatAppStaticEngagement,
  wbcChatAppButtonEngagement,
  getWidgetOptions,
};
