/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 *  Botmaster middleware generating function to connect fulfill to botmaster as outgoing middleware.
 *  @private
 */
const MODULE_ID = 'aca-middleware-fulfill-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  getUpdateSessionContextAttribute,
} = require('@ibm-aiap/aiap-utils-soe-update');

const {
  actionsNativeRegistry,
  actionsTenantRegistry,
} = require('../actions-registries');

const { fulfill } = require('./fulfill');

const textLens = ramda.lensPath(['message', 'message', 'text']);
const defaultInput = ramda.view(textLens);

const defaultResponse = ({ message, response }) => {
  try {
    if (!response || typeof response !== 'string') {
      return 'cancel';
    }
    const trimmedResponse = response.trim(' ');
    if (ramda.isEmpty(trimmedResponse)) {
      return 'cancel';
    }
    message.message.text = trimmedResponse;
    if (logger.isDebug()) {
      logger.debug(`fulfill sent new message:}`, { message });
    }
    return;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(defaultResponse.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _executeFulFill = (reponseTransformer, actions, params, input) => {
  let bot;
  let message;
  let update;
  try {
    bot = params?.bot;
    message = params?.message;
    update = params?.update;
    const RET_VAL = new Promise((resolve, reject) => {
      fulfill(actions, params, input, (error, response) => {
        let retVal;
        if (response && response.includes('ACA_CANCEL_OUTGOING_THREAD')) {
          retVal = 'cancel';
        } else if (!error) {
          retVal = reponseTransformer({ bot, message, update, response });
        } else {
          retVal = error;
        }
        resolve(retVal);
      });
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_executeFulFill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const __shouldSkip = (context) => {
  const PARAMS = {
    update: context?.update,
    skipSenderActionTypes: ['LOG_USER_ACTION'],
  };

  const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

  if (IGNORE_BY_SENDER_ACTION_TYPE) {
    return true;
  }

  return false;
};

const FulfillWare = (options) => {
  const RET_VAL = {
    type: 'outgoing',
    name: 'fulfill-ware-out',
    shouldSkip: __shouldSkip,
    controller: async (bot, update, message) => {
      const G_ACA_PROPS = getUpdateSessionContextAttribute(update, 'gAcaProps');
      const G_ACA_PROPS_TENANT_ID = G_ACA_PROPS?.tenantId;
      try {
        if (logger.isDebug()) {
          logger.debug(`Received message:`, { message });
        }
        const {
          inputTransformer = defaultInput,
          reponseTransformer = defaultResponse,
          params = {},
        } = options;
        if (logger.isDebug()) {
          logger.debug(`->`, { text: inputTransformer({ bot, message }) });
        }

        const NATIVE_ACTIONS = actionsNativeRegistry.getRegistry();
        const TENANT_ACTIONS = actionsTenantRegistry.getTenantRegistry(
          G_ACA_PROPS_TENANT_ID
        );

        const ACTIONS = {
          ...NATIVE_ACTIONS,
          ...TENANT_ACTIONS,
        };
        const input = inputTransformer({ bot, update, message });
        let retVal;
        if (input) {
          params.bot = bot;
          params.update = update;
          params.message = message;
          retVal = await _executeFulFill(
            reponseTransformer,
            ACTIONS,
            params,
            input
          );
        }
        return retVal;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('FulfillWare', { ACA_ERROR });
        throw ACA_ERROR;
      }
    },
  };
  return RET_VAL;
};

module.exports = {
  FulfillWare,
};
