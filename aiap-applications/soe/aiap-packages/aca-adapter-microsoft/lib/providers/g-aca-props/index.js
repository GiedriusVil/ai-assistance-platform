/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-g-aca-props-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');

const G_ACA_PROPS = {};

const initGAcaProps = async (sourceConfig) => {
  const APP_ID = ramda.path(['appId'], sourceConfig);
  const G_ACA_PROP = new GAcaPropsProvider(sourceConfig);
  await appendTenantHash(G_ACA_PROP);
  G_ACA_PROPS[APP_ID] = G_ACA_PROP;
}

const initGAcaPropsProvider = async (CONFIG) => {
  const SOURCES_CONFIG = ramda.path(['gAcaProps'], CONFIG);
  if (
    !lodash.isEmpty(SOURCES_CONFIG) &&
    lodash.isArray(SOURCES_CONFIG)
  ) {
    for (let sourceConfig of SOURCES_CONFIG) {
      await initGAcaProps(sourceConfig);
    }
    logger.info('INITIALIZED');
  } else {
    logger.warn(`[${MODULE_ID}] Missing Microsoft Adapter configuration!`);
  }
}

const getGAcaPropsByAppId = (appId) => {
  const RET_VAL = G_ACA_PROPS[appId];
  return RET_VAL;
}

const getGAcaPropsByBot = (bot) => {
  const BOT_ID = ramda.path(['credentials', 'appId'], bot);
  const RET_VAL = getGAcaPropsByAppId(BOT_ID);
  return RET_VAL;
}

const getGAcaProps = (context) => {
  return G_ACA_PROPS;
}

const appendTenantHash = async (gAcaProps) => {
  const TENANT_ID = ramda.path(['tenantId'], gAcaProps);
  try {
    if (lodash.isEmpty(TENANT_ID)) {
      const MESSAGE = `Missing tenantId required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.reloadOneById({ id: TENANT_ID });
    const TENANT_HASH = ramda.path(['hash'], TENANT);
    gAcaProps.tenantHash = TENANT_HASH;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('appendTenantHash ->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

class GAcaPropsProvider {

  constructor(config) {
    this.tenant = config.tenant;
    this.tenantId = config.tenantId;
    this.assistantId = config.assistantId;
    this.engagementId = config.engagementId;
    this.displayName = config.displayName;
    this.isoLang = config.isoLang;
    this.lang = config.isoLang;
  }
}

module.exports = {
  GAcaPropsProvider,
  initGAcaPropsProvider,
  getGAcaPropsByAppId,
  getGAcaPropsByBot,
  getGAcaProps,
};
