/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-abstract-bot-abstract-bot-v1-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ISoeUpdateV1,
  ISoeRawMessageV1,
  ISoeRawBodyV1,
  ISoeSendMessageOptionsV1,
  ISoeOutgoingMessageFormattedV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  AbstractBotV1,
  OutgoingMessage,
} from '@ibm-aiap/aiap-soe-engine';

const {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
  appendDataToError
} = require('@ibm-aca/aca-utils-errors');

const {
  setUpdateRawMessage,
  setUpdateSender,
} = require('@ibm-aiap/aiap-utils-soe-update');

export abstract class SoeBotV1 extends AbstractBotV1 {

  isConcierge: any;
  implements: any;
  actions: any;
  useEngagements: any;
  checkSlotAvailability: any;
  dataLoader: any;

  structuredContent: any;

  constructor(
    params: {
      settings: {
        concierge?: any,
        isActive: any,
      },
      server: any,
      sessionStorage: any,
    }
  ) {
    super(params);
    this.isConcierge = params?.settings?.concierge ? params?.settings?.isActive : false;
    this.implements = {
      clientSideMasking: false,
      concierge: false,
      tagReplace: false,
      structuredMessage: false,
      typing: false,
      video: false,
      close: false,
    };
    this.actions = {};
    this.useEngagements = false;
    this.checkSlotAvailability = false;
  }

  setDataLoader(
    dataLoader: any,
  ) {
    this.dataLoader = dataLoader;
  }

  getLoaderData(
    loaderName: any,
  ) {
    if (
      this.dataLoader &&
      this.dataLoader.loaderExists(loaderName)
    ) {
      return this.dataLoader.getLoaderData(loaderName);
    }
    throw new Error(`DataLoader not defined - ${loaderName}!`);
  }

  /**
 * @deprecated --> Use --> @sendUpdateByIncomingMessage
 */
  async sendUpdate(
    update: ISoeUpdateV1,
    message: any,
    context?: any,
  ) {
    try {
      if (
        lodash.isEmpty(update?.sender)
      ) {
        const ERROR_MESSAGE = `Missing required update.sender parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      await this.__emitUpdate(
        ramda.mergeDeepRight(
          update,
          {
            timestamp: new Date(),
            sender: update?.sender,
            raw: {
              message: {
                text: message,
              },
            },
            context: context,
          })
      );

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error(this.sendUpdate, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  /**
  * @deprecated --> Use --> @sendUpdateByIncomingMessage
  */
  sendUpdateAsSystem(
    update: ISoeUpdateV1,
    message: any,
    context: any,
  ) {
    try {
      if (
        lodash.isEmpty(update?.sender)
      ) {
        const ERROR_MESSAGE = `Missing required update.sender parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      this.__emitUpdate(
        ramda.mergeDeepRight(update, {
          timestamp: new Date(),
          sender: update?.sender,
          raw: {
            message: {
              text: message,
              type: 'system'
            }
          },
          context: context,
        })
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error(this.sendUpdateAsSystem.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  sendUpdateByIncomingMessage(
    update: ISoeUpdateV1,
    message: any,
    context: any,
  ) {
    try {
      if (
        lodash.isEmpty(update?.sender)
      ) {
        const ERROR_MESSAGE = `Missing required update.sender parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        !lodash.isObject(message) &&
        !lodash.has(message, 'text')
      ) {
        const MESSAGE = 'Message parameter must be an object with message.text property!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { message });
      }
      setUpdateSender(update, update?.sender);
      setUpdateRawMessage(update, message);
      this.__emitUpdate(
        ramda.mergeDeepRight(update, {
          timestamp: Math.floor(Date.now()),
          session: {
            context: context,
          }
        })
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error('sendUpdateByIncomingMessage', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  // TODO --> 2023-09-19 --> LEGO --> Seems to be unused
  // checkAvailableSlots(
  //   chatSessionId,
  //   skills,
  // ) {
  //   if (this.checkSlotAvailability) return this.__checkAvailableSlots(chatSessionId, skills);
  // }

  // TODO --> 2023-09-19 --> LEGO --> Seems to be unused
  // matchSkill(chatSessionId, skills, index) {
  //   return this.__matchSkill(chatSessionId, skills, index);
  // }

  // TODO --> 2023-09-19 --> LEGO --> Seems to be unused
  // sendMetrics(sender, journey, stage) {
  //   if (this.__sendMetrics) this.__sendMetrics(sender, journey, stage);
  // }

  formatSuggestEntities(
    entities: any,
    before: any,
    max: any,
  ) {
    const wrappedResults = entities
      .slice(0, max)
      .map(result => `<button>${result}</button>`)
      .join('');
    return `${before}${wrappedResults}`;
  }

  async closeConversation(
    update: ISoeUpdateV1
  ) {
    this.__closeConversation(update);
  }

  getTraceId(
    update: ISoeUpdateV1,
  ) {
    let agentId;
    let conversationId;
    try {
      agentId = this.__getAgentId();
      conversationId = this.__getConversationId(update);

      const RET_VAL = ramda.mergeRight(
        update ? update.traceId || {} : {},
        {
          agentId,
          conversationId,
        }
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.getTraceId.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  getVisitorId() {
    throw new Error('Missing getVisitorId method implementation');
  }

  retrieveGreetingStatus() {
    if (
      this.useEngagements
    ) {
      throw new Error('Missing retrieveGreetingStatus implementation');
    } else {
      return Promise.resolve();
    }
  }

  async status() {
    const RET_VAL = {
      status: 'N/A',
    }
    return RET_VAL;
  }

  async __emitUpdate(
    update: ISoeUpdateV1,
  ) {
    super.__emitUpdate(update);
  }

  async __createStandardBodyResponseComponents(
    sentOutgoingMessage: any,
    sentRawMessage?: ISoeRawMessageV1,
    raw?: ISoeRawBodyV1,
  ) {
    const RET_VAL = {
      recipient_id: sentOutgoingMessage.recipient.id,
      message_id: 'test',
    }
    return RET_VAL;
  }

  __supportsAttachment(
    attachment: any,
  ) {
    const RET_VAL =
      !!this.structuredContent[attachment.type] &&
      attachment.attachments &&
      attachment.attachments.length > 0;

    return RET_VAL;
  }

  __transformToRichContent(
    outgoingMessage: any,
  ) {
    const attachment = outgoingMessage?.message?.attachment;
    const transformer = this.structuredContent[attachment.type];
    return transformer(attachment.attachments);
  }

  __supportsRichContent() {
    const RET_VAL = this.implements.richContent;
    return RET_VAL;
  }

  __isAction(
    params: {
      update: any,
      message: any,
    },
  ) {
    const RET_VAL = !!params?.message?.sender_action;
    return RET_VAL;
  }

  __isAttachment(
    params: {
      update: any,
      message: any,
    },
  ) {
    const RET_VAL = !!params?.message?.message?.attachment;
    return RET_VAL;
  }

  async __respond(
    params: {
      update: any,
      message: any,
    },
  ) {
    let retVal;
    if (
      this.__isAction(params)
    ) {
      retVal = await this.__respondWithAction(params);
    } else if (
      this.__isAttachment(params)
    ) {
      retVal = await this.__respondWithAttachment(params);
    } else {
      retVal = await this.__respondWithTextMessage(params);
    }
    return retVal;
  }

  __getAgentId() {
    const ERROR_MESSAGE = `Missing AbstractBotV1.__getAgentId implementation! `
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }

  __getConversationId(
    update: ISoeUpdateV1,
  ) {
    const ERROR_MESSAGE = `Missing AbstractBotV1.__getConversationId implementation! [senderId: ${update?.sender?.id}]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }

  abstract __closeConversation(
    update?: ISoeUpdateV1,
    reason?: any
  ): Promise<void>;

  abstract __respondWithAction(
    params: {
      update: any,
      message: any,
    },
  ): Promise<void>;

  abstract __respondWithAttachment(
    params: {
      update: any,
      message: any,
    },
  ): Promise<any>;

  async __respondWithTextMessage(
    params: {
      update: any,
      message: any,
    },
  ) {
    const RET_VAL = await this.__sendMessageAsText(params);
    return RET_VAL;
  }

  abstract __sendMessageAsText(
    params: {
      update: any,
      message: any,
    },
  ): Promise<any>;

}
