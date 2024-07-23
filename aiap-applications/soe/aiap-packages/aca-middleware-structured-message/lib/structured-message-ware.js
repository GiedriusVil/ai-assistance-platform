/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-structured-message-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { parseToTree } = require('@ibm-aiap/aiap-wrapper-posthtml-parser');
const { __render } = require('@ibm-aiap/aiap-wrapper-posthtml-render');

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

const facebookButtonTransformer = require('./facebook-buttons-transformer');
const customersSkipRegexp = /twilio|facebook/;
const BUTTON_TAG = 'button';
const TAGS_SUPPORTED = [BUTTON_TAG];

const skip = (update) =>
  ramda.test(
    customersSkipRegexp,
    ramda.view(ramda.lensProp('customerId'), update)
  );

const render = (tree) => {
  const opts = {
    closingSingleTag: 'slash',
    singleTags: ['video', 'pause', 'handover'],
  };
  return __render(tree, opts);
};

const hasSupportedTag = (tree, supportedTags = TAGS_SUPPORTED) => {
  let hasSupportedTag = false;
  tree.forEach((value) => {
    if (!(typeof value == 'string' || value instanceof String)) {
      if (supportedTags.includes(value.tag)) {
        hasSupportedTag = true;
      }
    }
  });
  return hasSupportedTag;
};

const supportsTag = (tag) => TAGS_SUPPORTED.includes(tag);

const createStructuredMessage = (
  tree,
  update,
  transformButtonsOnly,
  transformer
) => {
  let before = '';
  let buttons = [];

  tree.forEach((value) => {
    if (value.tag && !supportsTag(value.tag)) {
      before = before + render(value);
    }
    if (typeof value == 'string' || value instanceof String) {
      if (value.trim()) before = before + value.trim();
    }
    if (value.tag === BUTTON_TAG) {
      buttons.push(ramda.mergeRight({ text: value.content[0] }, value.attrs));
    }
  });
  // adding pause here to cut message, as due to suggested entities we can use it from WCS
  if (transformButtonsOnly) {
    return `${before}<pause />${transformer({ buttons })}`;
  } else {
    return transformer({ buttons, before }, update);
  }
};

class StructuredMessageWare extends AbstractMiddleware {
  constructor(transformButtons, transformButtonsOnly = false) {
    super(
      [botStates.NEW, botStates.UPDATE],
      'structured-message-ware',
      middlewareTypes.OUTGOING
    );
    this.transformButtons = transformButtons || (({ before }) => before);
    this.transformButtonsOnly = transformButtonsOnly;
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

  async executor(bot, update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      if (bot.implements && bot.implements.structuredMessage && !skip(update)) {
        if (logger.isDebug())
          logger.debug('Will search for structured buttons', {
            message: message.message.text,
            update: update,
          });
        const tree = parseToTree(message.message.text);

        if (!hasSupportedTag(tree)) {
          if (logger.isDebug())
            logger.debug('No supported tags found. Returning same', {
              update: update,
            });
          return;
        }

        message.message.text = createStructuredMessage(
          tree,
          update,
          this.transformButtonsOnly,
          this.transformButtons
        );
        if (logger.isDebug())
          logger.debug('Transformed message', {
            transformed: message.message.text,
            update,
          });
        message.addAttachment(
          createStructuredMessage(
            tree,
            update,
            false,
            facebookButtonTransformer
          )
        );
        return;
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
  StructuredMessageWare,
};
