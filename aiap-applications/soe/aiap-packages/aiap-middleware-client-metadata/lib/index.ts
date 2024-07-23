/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-client-metadata-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { shouldSkipBySenderActionTypes } from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

class ClientMetadataToContextWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'client-metadata-ware',
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

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1) {
    try {
      if (logger.isDebug()) {
        logger.debug('Checking for context to add', { update });
      }
      if (!update.session.context) {
        update.session.context = {};
      }
      const values = {};
      const METADATA = update?.metadata?.metadata || [];
      if (METADATA) {
        METADATA.forEach((item) => {
          values[item.key] = item.value;
        });
      }
      update.session.context = ramda.mergeAll([update.session.context, values]);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  ClientMetadataToContextWare,
};
