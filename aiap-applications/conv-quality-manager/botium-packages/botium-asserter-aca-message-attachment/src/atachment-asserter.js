/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'botium-asserter-aca-message-attachment';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const util = require('util');
const linkify = require('linkifyjs');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { BotiumError } = require('botium-core');

module.exports = class AttachmentAsserter {
  
  constructor(context, caps = {}, args = {}) {
    this.context = context
    this.caps = caps
  }

  sanitizeAttachment(attachment) {
    const RET_VAL = [];
    const ATTACHMENTS = attachment?.attachments;
    if (
      lodash.isArray(ATTACHMENTS) &&
      !lodash.isEmpty(ATTACHMENTS)
    )
      ATTACHMENTS.forEach(attachment => {
        const ATTACHMENT_METADATA = attachment?.metadata;
        if (!lodash.isEmpty(ATTACHMENT_METADATA)) {
          delete attachment.metadata
        }
      });
    }

  assertConvoStep({ convoStep, args, botMsg }) {
    const ATTACHMENT_FROM_MESSAGE = botMsg?.sourceData?.message?.attachment;
    this.sanitizeAttachment(ATTACHMENT_FROM_MESSAGE);
    const ATTACHMENT_FROM_CONDITION_RAW = ramda.path([0], args);
    const ATTACHMENT_FROM_CONDITION = JSON.parse(ATTACHMENT_FROM_CONDITION_RAW);
    this.sanitizeAttachment(ATTACHMENT_FROM_CONDITION);
    const IS_MATCH = lodash.isMatch(ATTACHMENT_FROM_MESSAGE, ATTACHMENT_FROM_CONDITION);
    logger.info(`IS_MATCH -> `, { IS_MATCH });

    if (IS_MATCH) {
      return Promise.resolve();
    } else {
      return Promise.reject(new BotiumError(`${convoStep.stepTag}: Expected acaAttachment was not sub-set of received acaAttachment!`,
        {
          expected: ATTACHMENT_FROM_CONDITION, 
          received: ATTACHMENT_FROM_MESSAGE
        }
      ));
    }
  }

  _assertConvoStep({ convoStep, args, botMsg }) {
    const uniqueArgs = lodash.uniq(args || [])

    let links = (linkify.find(botMsg.messageText) || []).map(u => u.href)
    if (botMsg.buttons) {
      botMsg.buttons.forEach(b => {
        links.push(b.payload)
        links.push(b.imageUri)
      })
    }
    if (botMsg.media) {
      botMsg.media.forEach(m => {
        links.push(m.mediaUri)
      })
    }
    links = links.filter(s => s && lodash.isString(s))
    debug(`all found links : ${util.inspect(links)}`)

    if (!args || args.length === 0) {
      if (links.length) {
        return Promise.resolve()
      }
      return Promise.reject(new BotiumError(`${convoStep.stepTag}: Some link(s) expected`,
        {
          type: 'asserter',
          source: 'BasicLinkAsserter',
          context: {
            constructor: {},
            params: {
              args
            }
          },
          cause: {
            expected: uniqueArgs,
            actual: links
          }
        }
      ))
    }

    const notFoundLinks = uniqueArgs.reduce((acc, requiredLink) => {
      if (links.findIndex(u => u.includes(requiredLink)) < 0) {
        acc.push(requiredLink)
      }
      return acc
    }, [])

    if (notFoundLinks.length > 0) {
      return Promise.reject(new BotiumError(`${convoStep.stepTag}: Expected link(s) "${notFoundLinks}", but only found link(s) "${links}"`,
        {
          type: 'asserter',
          source: 'BasicLinkAsserter',
          context: {
            constructor: {},
            params: {
              args
            }
          },
          cause: {
            expected: uniqueArgs,
            actual: links,
            diff: notFoundLinks
          }
        }
      ))
    }
    return Promise.resolve()
  }
}
