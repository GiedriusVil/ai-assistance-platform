/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-client-profile-context`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
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
  getUpdateSenderId,
  getUpdatePrivateProfile,
} = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class ClientProfileContextWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
      ],
      'client-profile-context-ware',
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
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    const UPDATE_PRIVATE_PROFILE = getUpdatePrivateProfile(update);

    let configuration;
    let configurationFilters;

    try {
      configuration = getLibConfiguration();
      configurationFilters = configuration?.filters;

      if (
        logger.isDebug()
      ) {
        logger.debug('Checking for clientProfile to add to context', {
          update,
        });
      }

      if (
        !lodash.isEmpty(UPDATE_PRIVATE_PROFILE)
      ) {
        const PROFILE = {};
        const FILTERS = configurationFilters
          ? configurationFilters.split(',').map(
            (filter) => {
              return filter.trim().toUpperCase();
            }
          )
          : [];

        for (let item of UPDATE_PRIVATE_PROFILE) {
          if (
            item.key &&
            ramda.is(String, item.key) &&
            ramda.hasPath(['value'], item)
          ) {
            if (!FILTERS.includes(item.key.toUpperCase())) {
              continue;
            }
            PROFILE[item.key] = item.value;
          }
        }
        if (!update.session.context) {
          update.session.context = {
            profile: PROFILE,
          };
        } else {
          const context = ramda.pathOr({}, ['profile'], update.session.context);
          update.session.context.profile = ramda.mergeAll([context, PROFILE]);
        }
      }
      logger.debug('ClientProfile check finished', { update });
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  ClientProfileContextWare,
};
