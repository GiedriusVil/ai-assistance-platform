/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-engine-abstract-bot-v1';

const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import EventEmitter from 'node:events';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
  ISoeSendMessageOptionsV1,
  ISoeOutgoingMessageFormattedV1,
} from '@ibm-aiap/aiap--types-soe';

import { OutgoingMessage } from './outgoing-message';

import { SendMessageTypeError } from './errors';

import { Botmaster } from './botmaster';

export abstract class AbstractBotV1 extends EventEmitter {

  static createOutgoingMessageFor(recipientId: string) {
    const RET_VAL = new OutgoingMessage().addRecipientById(recipientId);
    return RET_VAL;
  }

  static createOutgoingMessage(message: any) {
    return new OutgoingMessage(message);
  }

  id?: string;
  settings: any;
  server: any;
  sessionStorage: any;
  type: string;
  receives: {
    text?: any,
    attachment?: {
      audio?: any,
      file?: any,
      image?: any,
      video?: any,
      location?: any,
      // can occur in FB messenger when user sends a message which only contains a URL
      // most platforms won't support that
      fallback?: any,
    },
    echo?: any,
    read?: any,
    delivery?: any,
    postback?: any,
    quickReply?: any,
  }
  sends: {
    text?: any,
    quickReply?: any,
    locationQuickReply?: any,
    senderAction?: {
      typingOn?: any,
      typingOff?: any,
      markSeen?: any,
    },
    attachment?: {
      audio?: any,
      file?: any,
      image?: any,
      video?: any,
    },
  };
  retrievesUserInfo: any;
  requiresWebhook: boolean;
  webhookEndpoint?: {
    [key: string]: any,
  }
  requiredCredentials: string[];
  credentials?: {
    [key: string]: any,
  }

  __associatedUpdate: ISoeUpdateV1;

  master: Botmaster;
  requestListener: any;

  constructor(
    params: {
      settings: any,
      server: any,
      sessionStorage: any,
    }
  ) {
    super();
    if (
      !params?.settings
    ) {
      const ERROR_MESSAGE = 'Missing required params?.settings parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    this.settings = params?.settings;

    if (
      !params?.server
    ) {
      const ERROR_MESSAGE = 'Missing required params?.server parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    this.server = params?.server;

    if (
      !params?.sessionStorage
    ) {
      const ERROR_MESSAGE = 'Missing required params?.sessionStorage parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    this.sessionStorage = params?.sessionStorage;

    this.type = 'baseBot';

    this.receives = {
      text: false,
      attachment: {
        audio: false,
        file: false,
        image: false,
        video: false,
        location: false,
        // can occur in FB messenger when user sends a message which only contains a URL
        // most platforms won't support that
        fallback: false,
      },
      echo: false,
      read: false,
      delivery: false,
      postback: false,
      // in FB Messenger, this will exist whenever a user clicks on
      // a quick_reply button. It will contain the payload set by the developer
      // when sending the outgoing message. Bot classes should only set this
      // value to true if the platform they are building for has an equivalent
      // to this.
      quickReply: false,
    };

    this.sends = {
      text: false,
      quickReply: false,
      locationQuickReply: false,
      senderAction: {
        typingOn: false,
        typingOff: false,
        markSeen: false,
      },
      attachment: {
        audio: false,
        file: false,
        image: false,
        video: false,
      },
    };

    this.retrievesUserInfo = false;

    this.requiresWebhook = false;
    this.requiredCredentials = [];
  }

  __applySettings(
    settings: {
      credentials?: any,
      webhookEndpoint: any,
    }
  ) {
    if (
      typeof settings !== 'object'
    ) {
      throw new TypeError(`settings must be object, got ${typeof settings}`);
    }
    if (
      this.requiredCredentials.length > 0
    ) {
      if (
        !settings.credentials
      ) {
        throw new Error(`no credentials specified for bot of type '${this.type}'`);
      } else {
        this.credentials = settings.credentials;
      }
      for (const credentialName of this.requiredCredentials) {
        if (
          !this.credentials[credentialName]
        ) {
          throw new Error(`bots of type '${this.type}' are expected to have '${credentialName}' credentials`);
        }
      }
    }
    if (
      this.requiresWebhook
    ) {
      if (
        !settings.webhookEndpoint
      ) {
        throw new Error(`bots of type '${this.type}' must be defined with webhookEndpoint in their settings`);
      } else {
        this.webhookEndpoint = settings.webhookEndpoint;
      }
    } else if (
      settings.webhookEndpoint
    ) {
      throw new Error(`bots of type '${this.type}' do not require webhookEndpoint in their settings`);
    }
  }

  createOutgoingMessage(message?: any) {
    const RET_VAL = AbstractBotV1.createOutgoingMessage(message);
    return RET_VAL;
  }

  createOutgoingMessageFor(recipientId: string) {
    const RET_VAL = AbstractBotV1.createOutgoingMessageFor(recipientId);
    return RET_VAL;
  }

  async sendMessage(
    message: OutgoingMessage | { [key: string | number | symbol]: any },
    options?: ISoeSendMessageOptionsV1,
  ) {
    let outgoingMessage: OutgoingMessage;
    let outgoingMessageFormatted: any;
    let status;
    let retVal;
    try {
      options = options || {}; // empty object if undefined
      outgoingMessage = !(message instanceof OutgoingMessage) ? new OutgoingMessage(message) : message;
      await this.__validateSendOptions(options);
      if (
        this.master &&
        !options.ignoreMiddleware
      ) {
        status = await this.master.middleware.__runOutgoingMiddleware(
          this,
          this.__associatedUpdate,
          outgoingMessage
        );
      }
      if (
        'cancel' === status
      ) {
        return status;
      }
      outgoingMessageFormatted = await this.__formatOutgoingMessage(outgoingMessage, options);
      await this.__sendMessage(outgoingMessageFormatted, options);
      retVal = {
        outgoingMessage,
        outgoingMessageFormatted,
      };
      retVal.recipient_id = await this.__retrieveRecipientId(
        outgoingMessage,
        outgoingMessageFormatted,
      );
      retVal.message_id = await this.__retrieveMessageId(
        outgoingMessage,
        outgoingMessageFormatted,
      );
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  sendMessageTo(
    message: any,
    recipientId: string,
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    const outgoingMessage = this.createOutgoingMessage({
      message,
    });
    outgoingMessage.addRecipientById(recipientId);

    return this.sendMessage(outgoingMessage, sendOptions);
  }

  async sendTextMessageTo(
    text: string,
    recipientId: string,
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    try {
      if (
        !this?.sends?.text
      ) {
        throw new SendMessageTypeError(this.type, 'text');
      }
      const outgoingMessage = this.createOutgoingMessage()
        .addRecipientById(recipientId)
        .addText(text);

      const RET_VAL = await this.sendMessage(outgoingMessage, sendOptions);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendTextMessageTo.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async reply(
    update: ISoeUpdateV1,
    text: string,
    options?: ISoeSendMessageOptionsV1,
  ) {
    try {
      if (
        lodash.isEmpty(update?.sender?.id)
      ) {
        const MESSAGE = `Missing required update.sender.id parameter`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RET_VAL = await this.sendTextMessageTo(text, update.sender.id, options);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.reply.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  sendAttachmentTo(attachment, recipientId, sendOptions) {
    if (
      !ramda.path(['sends', 'attachment'], this)
    ) {
      return Promise.reject(new SendMessageTypeError(this.type, 'attachment'));
    }
    const outgoingMessage = this.createOutgoingMessage()
      .addRecipientById(recipientId)
      .addAttachment(attachment);

    return this.sendMessage(outgoingMessage, sendOptions);
  }

  sendAttachmentFromUrlTo(type, url, recipientId, sendOptions) {
    if (
      !ramda.path(['sends', 'attachment', type], this)
    ) {
      let cantThrowErrorMessageType = `${type} attachment`;
      if (
        !ramda.path(['sends', 'attachment'], this)
      ) {
        cantThrowErrorMessageType = 'attachment';
      }
      return Promise.reject(new SendMessageTypeError(this.type, cantThrowErrorMessageType));
    }
    const attachment = {
      type,
      payload: {
        url,
      },
    };

    return this.sendAttachmentTo(attachment, recipientId, sendOptions);
  }

  sendDefaultButtonMessageTo(
    buttonTitles,
    textOrAttachment,
    recipientId
  ) {
    const validateSendDefaultButtonMessageToArguments = () => {
      let err = null;
      if (
        !this.sends.quickReply
      ) {
        err = new SendMessageTypeError(this.type, 'quick replies');
      } else if (buttonTitles.length > 10) {
        err = new RangeError('buttonTitles must be of length 10 or less');
      }
      if (
        textOrAttachment
      ) {
        if (
          textOrAttachment.constructor === String
        ) {
          if (
            !this.sends.text
          ) {
            err = new SendMessageTypeError(this.type, 'text');
          }
        } else if (
          textOrAttachment.constructor === Object &&
          textOrAttachment.type
        ) {
          if (
            !this.sends.attachment
          ) {
            err = new SendMessageTypeError(this.type, 'attachment');
          } else if (
            !this.sends.attachment[textOrAttachment.type]
          ) {
            err = new SendMessageTypeError(this.type, `${textOrAttachment.type} attachment`);
          }
        } else {
          err = new TypeError('third argument must be a "String", an attachment "Object" or absent');
        }
      }
      return err;
    };

    const potentialError = validateSendDefaultButtonMessageToArguments();

    if (
      potentialError
    ) {
      return Promise.reject(potentialError);
    }

    // //////////////////////////////////////////////////////
    // actual code after validating with
    // validateSendDefaultButtonMessageToArguments function
    // //////////////////////////////////////////////////////

    const outgoingMessage = this.createOutgoingMessage();
    outgoingMessage.addRecipientById(recipientId);
    // deal with textOrAttachment
    if (!textOrAttachment && this.sends.text) {
      outgoingMessage.addText('Please select one of:');
    } else if (textOrAttachment.constructor === String) {
      outgoingMessage.addText(textOrAttachment as string);
    } else {
      // it must be an attachment or an error would have been thrown
      outgoingMessage.addAttachment(textOrAttachment);
    }

    const quickReplies = [];

    for (const buttonTitle of buttonTitles) {
      quickReplies.push({
        content_type: 'text',
        title: buttonTitle,
        payload: buttonTitle, // indeed, in default mode payload is buttonTitle
      });
    }

    outgoingMessage.addQuickReplies(quickReplies);

    // eslint-disable-next-line prefer-rest-params
    return this.sendMessage(outgoingMessage, arguments[3]);
  }

  async sendIsTypingMessageTo(
    params: {
      recipientId: string,
      traceId: string,
    },
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    const RECIPIENT_ID = params?.recipientId;
    const TRACE_ID = params?.traceId;

    if (
      !this?.sends?.senderAction?.typingOn
    ) {
      return Promise.reject(new SendMessageTypeError(this.type, 'typing_on sender action'));
    }

    const isTypingMessage = {
      recipient: {
        id: RECIPIENT_ID,
      },
      sender_action: 'typing_on',
      traceId: TRACE_ID
    };

    const RET_VAL = await this.sendMessage(isTypingMessage, sendOptions);
    return RET_VAL;
  }

  sendCascade(
    messageArray: {
      raw?: any,
      message?: any,
    }[],
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    const returnedBodies = [];

    let promiseCascade = Promise.resolve();

    for (const messageObject of messageArray) {
      promiseCascade = promiseCascade.then((body: any) => {
        if (body) {
          returnedBodies.push(body);
        }
        if (messageObject.raw) {
          return this.sendRawMessage(messageObject.raw);
        } else if (messageObject.message) {
          return this.sendMessage(messageObject.message, sendOptions);
        }
        throw new Error('No valid message options specified');
      });
    }

    return promiseCascade.then(body => {
      // add last body and deal with potential callback
      returnedBodies.push(body);
      return returnedBodies;
    });
  }

  async sendTextCascadeTo(
    textArray: string[],
    recipientId: string,
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    const cascadeArray = textArray.map(text => {
      const outgoingMessage = this.createOutgoingMessageFor(recipientId).addText(text);

      return { message: outgoingMessage };
    });
    const RET_VAL = await this.sendCascade(cascadeArray, sendOptions);
    return RET_VAL;
  }

  async sendRawMessage(rawMessage: any) {
    const RET_VAL = await this.__sendMessage(rawMessage);
    return RET_VAL;
  }

  async __validateSendOptions(
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    try {
      if (
        typeof sendOptions === 'function'
      ) {
        const ERROR_MESSAGE = `Wrong type of sendOptions parameter! [Actual: fuction, Expected: object]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        typeof sendOptions !== 'object'
      ) {
        const ERROR_MESSAGE = `Wrong type of sendOptions parameter! [Actual: ${typeof sendOptions}, Expected: object]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__validateSendOptions.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __emitUpdate(
    update: ISoeUpdateV1,
  ) {
    try {
      if (
        !this.master
      ) {
        const ERROR_MESSAGE = `Bot needs to be added to botmaster instance in order to emit received updates!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE)
      }
      const RET_VAL = await this.master.middleware.__runIncomingMiddleware(this, update);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__emitUpdate.name, { ACA_ERROR });
      const PATCHED_BOT = this.__createBotPatchedWithUpdate(update);
      this.emit('error', { bot: PATCHED_BOT, update, error: ACA_ERROR });
      return ACA_ERROR;
    }
  }

  getUserInfo(
    userId: string,
    options: {
      [key: string | number | symbol]: any,
    },
  ) {
    if (
      !this.retrievesUserInfo
    ) {
      return Promise.reject(TypeError(`Bots of type ${this.type} don't provide access to user info.`));
    }
    return this.__getUserInfo(userId, options);
  }

  __createBotPatchedWithUpdate(
    update: ISoeUpdateV1,
  ) {
    const newBot = Object.create(this);

    newBot.__associatedUpdate = update;

    return newBot;
  }

  abstract __formatOutgoingMessage(
    outgoingMessage: OutgoingMessage,
    sendOptions: ISoeSendMessageOptionsV1,
  ): Promise<ISoeOutgoingMessageFormattedV1>;

  abstract __sendMessage(
    message: any,
    sendOptions?: ISoeSendMessageOptionsV1,
  ): Promise<void>;

  abstract __retrieveRecipientId(
    outgoingMessage: OutgoingMessage,
    outgoingMessageFormatted: any,
  ): Promise<string>;

  abstract __retrieveMessageId(
    outgoingMessage: OutgoingMessage,
    outgoingMessageFormatted: any,
  ): Promise<string>;

  abstract __getUserInfo(
    userId: string,
    options: {
      [key: string | number | symbol]: any,
    });

}
