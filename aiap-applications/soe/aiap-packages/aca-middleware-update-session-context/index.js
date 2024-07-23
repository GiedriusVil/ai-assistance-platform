/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-update-session-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  // appendDataToError,
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
  getTenantsCacheProvider,
} = require('@ibm-aiap/aiap-tenants-cache-provider');

const ON_ERROR_MESSAGE = 'I am facing and error while updating session context';

const executorDefault = async (context, params) => {
  const MESSAGE = `Missing middleware implementation!`;
  throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
};

class UpdateSessionContextWare extends AbstractMiddleware {
  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE,
        botStates.MONITOR,
      ],
      'update-session-context-ware',
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
    let gAcaProps;
    let tenantsCacheProvider;
    let tenant;
    // let tenantId;
    // let tenantHash;

    try {
      gAcaProps = update?.raw?.gAcaProps;

      if (
        lodash.isEmpty(gAcaProps)
      ) {
        const MESSAGE = 'Unable to retrieve gAcaProps from update!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      tenantsCacheProvider = getTenantsCacheProvider();
      tenant = await tenantsCacheProvider.tenants.findOneByGAcaProps({
        gAcaProps,
      });
      // tenantId = tenant?.id;
      // tenantHash = tenant?.hash;

      if (
        lodash.isEmpty(tenant)
      ) {
        const MESSAGE = 'Unable to retrieve tenant from tenantCacheProvider!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      const PARAMS = { adapter, update, tenant };
      const CONTEXT = {
        user: {
          session: { tenant },
        },
      };

      await executeEnrichedByLambdaModule(
        MODULE_ID,
        executorDefault,
        CONTEXT,
        PARAMS
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
      sendErrorMessage(adapter, update, ON_ERROR_MESSAGE, ACA_ERROR);
      return 'cancel';
    }
  }
}

module.exports = {
  UpdateSessionContextWare,
};
