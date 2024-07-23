/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-button-skip';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import { parseToTree } from '@ibm-aiap/aiap-wrapper-posthtml-parser';
import { __render } from '@ibm-aiap/aiap-wrapper-posthtml-render';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

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

import { getConfiguration } from './configuration';

class ButtonSkipWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'button-skip-ware',
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

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1) {
    const CONFIGURATION = getConfiguration();
    const CONFIGURATION_CONCIERGE_IS_ACTIVE = CONFIGURATION?.concierge?.isActive;

    const UPDATE_SENDER_ID = CONFIGURATION?.sender?.id;
    let response = CONFIGURATION?.response?.update;

    try {
      if (CONFIGURATION_CONCIERGE_IS_ACTIVE) {
        const TREE = parseToTree(response);
        const HAS_TAG_BUTTON = ramda.any(ramda.propEq('tag', 'button'))(TREE);
        const HANDOVER_IDX = ramda.findIndex(ramda.propEq('tag', 'handover'))(
          TREE
        );
        const conciergeLensPath = ramda.lensPath(['attrs', 'concierge']);
        if (HANDOVER_IDX > -1) {
          adapter.__associatedUpdate.session.pendingReply = __render(
            TREE.slice(HANDOVER_IDX + 1)
          );
          logger.debug(
            'Handover tag to bot contains buttons in message, will be placed to pendingReply and removed',
            update
          );
          if (
            HAS_TAG_BUTTON &&
            'bot' ===
            ramda.view(conciergeLensPath)(
              ramda.find(ramda.propEq('tag', 'handover'))(TREE)
            )
          ) {
            const RENDER_TREE = ramda.without(
              ramda.filter(ramda.propEq('tag', 'button'))(TREE),
              TREE
            );
            response = __render(RENDER_TREE);
          }
        }
        update.response = update.response || {};
        update.response.text = response;
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID, response });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  ButtonSkipWare,
};
