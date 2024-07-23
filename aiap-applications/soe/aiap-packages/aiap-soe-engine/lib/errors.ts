/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-soe-engine-errors`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

export class SendMessageTypeError extends Error {

  constructor(botType: string, messageType: string) {
    super(`Bots of type ${botType} can't send messages with ${messageType}`);

    logger.error(
      `Tried sending message of type ${messageType} to bot of type ${botType} that do not support this message type`,
      {
        botType,
      }
    );
  }

}
