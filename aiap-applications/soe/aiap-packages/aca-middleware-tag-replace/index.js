/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-tag-replace-ware`;
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

class TagReplaceWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'tag-replace-ware',
      middlewareTypes.OUTGOING
    );
    this.tagsSupported = ['a'];
    this.joinWithNoSpace = ['</valueReplace>', '</getCustomerName>'];
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
      const processMessage = (incomingMessage) => {
        const tree = parseToTree(incomingMessage);
        let result = this.processObjects(tree, []);
        return this.render(result);
      };

      if (bot.implements && bot.implements.tagReplace) {
        logger.debug('Will search for tags to replace', {
          message: message.message.text,
          update: update,
        });
        message.message.text = processMessage(message.message.text);
        logger.debug('Transformed message', {
          message: message.message.text,
          update: update,
        });
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

  render(tree) {
    const opts = {
      closingSingleTag: 'slash',
      singleTags: ['video', 'pause'],
    };
    return __render(tree, opts);
  }

  processTag(value) {
    switch (value.tag) {
      case 'a':
        return value.attrs.href;
    }
  }

  processContent(array) {
    let result = [];
    array.forEach((node) => {
      if (typeof node == 'string' || node instanceof String) {
        result.push(node);
      } else if (this.tagsSupported.includes(node.tag)) {
        result.push(this.processTag(node));
      } else if (node.content) {
        let tmpNode = node;
        tmpNode.content = this.processContent(node.content, result);
        result.push(this.render(tmpNode));
      } else {
        result.push(this.render(node));
      }
    });
    return result;
  }

  processNode(node, result) {
    if (typeof node == 'string' || node instanceof String) {
      if (node.trim()) result.push(node.trim());
    } else if (this.tagsSupported.includes(node.tag)) {
      result.push(this.processTag(node));
    } else if (node.content) {
      let tmpNode = node;
      tmpNode.content = this.processContent(node.content, result);
      result.push(this.render(tmpNode).trim());
    } else {
      result.push(this.render(node).trim());
    }
  }

  joinResults(resultsArr) {
    let result = '';
    for (let i = 0; i < resultsArr.length; i++) {
      if (
        this.joinWithNoSpace.some(function (v) {
          return (
            resultsArr[i].indexOf(v) >= 0 &&
            i < resultsArr.length - 1 &&
            resultsArr[i + 1].charAt(0).toUpperCase() ==
            resultsArr[i + 1].charAt(0).toLowerCase()
          );
        })
      ) {
        result += resultsArr[i];
      } else {
        if (i == resultsArr.length - 1) {
          result += resultsArr[i];
        } else {
          result += resultsArr[i] + ' ';
        }
      }
    }
    return result;
  }

  processObjects(array, result) {
    array.forEach((node) => {
      this.processNode(node, result);
    });

    return this.joinResults(result);
    //return result.join(' ');
  }
}

module.exports = {
  TagReplaceWare,
};
