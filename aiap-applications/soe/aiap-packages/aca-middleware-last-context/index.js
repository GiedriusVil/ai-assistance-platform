/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-last-context-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { parseToTree } = require('@ibm-aiap/aiap-wrapper-posthtml-parser');

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

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

class LastContextWare extends AbstractMiddleware {
  constructor(opts) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'last-context-ware',
      middlewareTypes.INCOMING
    );
    this.ignoreTagChecks =
      opts && opts.ignoreTagChecks
        ? opts.ignoreTagChecks
        : { ignoreTagChecks: {} };
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

  executor(adapter, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      let tree = parseToTree(update?.response?.text);
      const containsRetryTag = this.ignoreTagChecks.retryTag
        ? false
        : ramda.any(ramda.propEq('tag', 'retryTag'))(tree);
      const containsFailTag = this.ignoreTagChecks.fail
        ? false
        : ramda.any(ramda.propEq('tag', 'fail'))(tree);
      if (
        !containsRetryTag &&
        !containsFailTag
      ) {
        if (logger.isDebug())
          logger.debug(
            'AiService response does not have retryTag/fail - saving context.',
            { update }
          );
        update.session.context = update.session.lastContext;
      } else {
        if (
          logger.isDebug()
        )
          logger.debug('Contains retry/fail tag, not saving context.', {
            update,
          });
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  LastContextWare,
};
