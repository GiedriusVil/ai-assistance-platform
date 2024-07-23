/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-channel-client-utils-transform-transcript';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const moment = require('moment-timezone');

import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';
import { transformTranscriptToBatch } from './transform-transcript-to-batch';

const AGENT_TIMEZONE = 'Europe/Helsinki';

const constructButtonText = (
  atttachment: any,
) => {
  try {
    let retVal = '';
    atttachment.attachments.forEach((button) => {
      retVal = retVal + `${button.title} \n`;
    });
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructButtonText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const transformTranscript = (
  transcript: any,
) => {
  try {
    const TYPES = {
      button: '-------- Chatbot tarjosi vaihtoehdot --------',
      bot: '-------- Chatbot lähetti viestin --------',
      user: '-------- Asiakas lähetti viestin --------',
      start: 'KESKUSTELU ALKOI',
      end: 'Asiakas kutsui palveluneuvojan'
    };
    let fullMessage = '';

    transcript.forEach((message, index) => {
      const TIMESTAMP = message?.timestamp;
      const DATE_IN_TIMEZONE = moment.utc(TIMESTAMP).tz(AGENT_TIMEZONE);

      const HOURS = DATE_IN_TIMEZONE.hours();
      let minutes = DATE_IN_TIMEZONE.minutes();
      if (
        minutes < 10
      ) {
        minutes = `0${DATE_IN_TIMEZONE.minutes()}`;
      }
      if (
        index == 0
      ) {
        fullMessage = fullMessage + `-------- ${HOURS}:${minutes} ${TYPES['start']} -------- \n`;
      }
      if (
        !lodash.isEmpty(message.attachment) &&
        message.attachment.type === 'buttons'
      ) {
        fullMessage = fullMessage + `${TYPES[message.type]} \n ${message.text} \n \n`;
        const BUTTONS = constructButtonText(message.attachment);
        fullMessage = fullMessage + `${TYPES.button} \n${BUTTONS} \n`;
      } else {
        fullMessage = fullMessage + `${TYPES[message.type]} \n ${message.text} \n \n`;
      }
      if (
        index === transcript.length - 1
      ) {
        fullMessage = fullMessage + `-------- ${HOURS}:${minutes} ${TYPES['end']} --------`;
      }
    });

    const BATCH =  transformTranscriptToBatch(fullMessage);
    const RET_VAL = [];

    for (const MESSAGE of BATCH) {
      RET_VAL.push({
        id: uuidv4(),
        type: 'user',
        message: {
          text: MESSAGE,
          timestamp: new Date().getTime()
        }
      });
    }
    
    logger.info(MODULE_ID, {  
      RET_VAL: JSON.stringify(RET_VAL) 
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  transformTranscript,
}
