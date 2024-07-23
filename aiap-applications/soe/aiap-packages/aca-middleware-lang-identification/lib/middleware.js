/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-lang-identification`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} = require('@ibm-aca/aca-utils-errors');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');

const {
  sendErrorMessage,
} = require('@ibm-aiap/aiap-utils-soe-messages');

const {
  executeEnrichedByLambdaModule,
} = require('@ibm-aca/aca-lambda-modules-executor');
const {
  getUpdateSessionContextAttribute,
} = require('@ibm-aiap/aiap-utils-soe-update');
const {
  getTenantsCacheProvider,
} = require('@ibm-aiap/aiap-tenants-cache-provider');

const ON_ERROR_MESSAGE = `[ERROR_NOTIFICATION] ${MODULE_ID}`;

const executorDefault = async (context, params) => {
  const MESSAGE = `Missing middleware implementation!`;
  throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
};

class LangIdentificationWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'lang-identification-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter, update) {
    let gAcaProps;
    let tenantsCacheProvider;
    let tenant;
    let tenantId;
    let tenantHash;
    try {
      gAcaProps = getUpdateSessionContextAttribute(update, 'gAcaProps');
      if (lodash.isEmpty(gAcaProps)) {
        const MESSAGE = 'Unable to retrieve gAcaProps from update!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      tenantsCacheProvider = getTenantsCacheProvider();
      tenant = await tenantsCacheProvider.tenants.findOneByGAcaProps({
        gAcaProps,
      });
      tenantId = tenant?.id;
      tenantHash = tenant?.hash;
      if (lodash.isEmpty(tenant)) {
        const MESSAGE = 'Unable to retrieve tenant from tenantCacheProvider!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const PARAMS = { adapter, update, tenant };
      const CONTEXT = {
        user: {
          session: { tenant },
        },
      };
      const RET_VAL = await executeEnrichedByLambdaModule(
        MODULE_ID,
        executorDefault,
        CONTEXT,
        PARAMS
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { tenantId, tenantHash });
      sendErrorMessage(adapter, update, ON_ERROR_MESSAGE, ACA_ERROR);
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  LangIdentificationWare,
};
