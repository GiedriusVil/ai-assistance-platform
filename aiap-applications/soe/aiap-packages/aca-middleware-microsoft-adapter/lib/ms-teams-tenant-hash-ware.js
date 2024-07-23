/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-microsoft-adapter-ms-teams-tenant-hash-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  formatIntoAcaError,
  appendDataToError,
  ACA_ERROR_TYPE,
  throwAcaError,
} = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');
const {
  getTenantsCacheProvider,
} = require('@ibm-aiap/aiap-tenants-cache-provider');

const CHANNEL = 'msteams';

class MsTeamsTenantHashWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW],
      'ms-teams-tenant-hash-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      if (update?.channel?.id === CHANNEL) {
        const G_ACA_PROPS = update?.raw?.gAcaProps;
        const TENANT_ID = G_ACA_PROPS?.tenantId;
        if (lodash.isEmpty(TENANT_ID)) {
          const MESSAGE = `Missing tenantId required parameter!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
        const TENANT = await TENANTS_CACHE_PROVIDER.tenants.reloadOneById({
          id: TENANT_ID,
        });
        const TENANT_HASH = ramda.path(['hash'], TENANT);
        update.raw.gAcaProps.tenantHash = TENANT_HASH;
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      return;
    }
  }
}

module.exports = {
  MsTeamsTenantHashWare,
};
