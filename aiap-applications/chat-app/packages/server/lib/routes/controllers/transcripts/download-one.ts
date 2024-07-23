/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app-controllers-transcripts-download-one';

const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import htmlparser2 from 'htmlparser2';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  createPDF,
  createDocumentDefinition,
  addStyles,
  addDefaultStyle,
  addContentText,
  addContentTable,
} from '@ibm-aca/aca-pdf-generator';

import {
  STYLES, 
  VALID_STYLES, 
  DEFAULT_STYLE
} from './pdf-format/styles';

import {
  HEADER, 
  DATE, 
  MESSAGE_TYPES,
  HTML_TAGS
} from './pdf-format/configs';

const downloadOne = async (request, response) => {
  const ERRORS = [];
  // Temporary disabled due to pdfmake lib error : "Error: Cannot find module 'functions-have-names'
  try {
    // const REQUEST_BODY = request?.body;
    // const TRANSCRIPT = REQUEST_BODY?.transcript;
    // const CONFIGURATION = REQUEST_BODY?.configuration;

    // if (lodash.isEmpty(TRANSCRIPT) || lodash.isEmpty(CONFIGURATION)) {
    //   ERRORS.push(_getValidationError);
    // }
    // const DOC_DEFINITION = _createDocumentDefinition(TRANSCRIPT, CONFIGURATION);
    // const PDF_FILE = await createPDF(DOC_DEFINITION);

    // response.contentType('application/pdf');
    // response.send(PDF_FILE);
    // response.status(200);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (!lodash.isEmpty(ERRORS)) {
    logger.error(ERRORS);
    response.status(500).json(ERRORS);
  }
};

const _getValidationError = () => {
  return {
    type: 'VALIDATION_ERROR',
    message: `[${MODULE_ID}] Missing required request.body paramater!`,
  };
};

const _createDocumentDefinition = (transcript, configuration) => {
  try {
    const ASSISTANT_NAME = configuration?.assistantDisplayName;
    const USER_NAME = configuration?.user?.firstName + ' ' + configuration?.user?.lastName;
    const RET_VAL = createDocumentDefinition();
    addStyles(STYLES, RET_VAL);
    addDefaultStyle(DEFAULT_STYLE, RET_VAL);
    _addHeader(configuration, RET_VAL);

    for (const MESSAGE of transcript) {
      const MESSAGE_TYPE = MESSAGE?.type;
      const SENDER = _getSender(MESSAGE_TYPE, ASSISTANT_NAME, USER_NAME);
      addContentText(SENDER, VALID_STYLES.SENDER, RET_VAL);
      addContentText(_getTransformedMessage(MESSAGE, RET_VAL), VALID_STYLES.TEXT, RET_VAL);
      addContentText(_getMessageTime(MESSAGE?.timestamp), VALID_STYLES.TIME, RET_VAL);
    }
    return RET_VAL;
  } catch (error) {
    _throwError(error, _createDocumentDefinition.name);
  }
};

const _getSender = (messageType, assistantName, userName) => {
  let retVal;
  if (messageType === MESSAGE_TYPES.BOT) {
    retVal = assistantName;
  } else if (messageType === MESSAGE_TYPES.USER){
    retVal = userName;
  } else {
    retVal = MESSAGE_TYPES.DEFAULT;
  }
  return retVal;
};

const _formatHeaderDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString(DATE.LOCALES, DATE.OPTIONS);
};

const _getMessageTime = (timestamp) => {
  const DATE = new Date(timestamp);
  const RET_VAL = DATE.getHours() + ':' + DATE.getMinutes();
  return RET_VAL;
};

const _getTransformedMessage = (message, docDef) => {
  try {
    const MESSAGE_TEXT = message?.text; 
    const DOUBLE_LINE_BREAK = '\n' + '\n';
    let retVal = [];

    if (!lodash.isEmpty(MESSAGE_TEXT)){
      retVal = _htmlToText(MESSAGE_TEXT, docDef);
    }
    if (
      lodash.isEmpty(MESSAGE_TEXT) && 
      !lodash.isEmpty(message?.attachment?.meta)
    ) {
      const ANSWERS = message?.attachment?.meta['ANSWERS'];
      for (const key in ANSWERS) {
        const ANSWER = ANSWERS[key];
        const ANSWER_TITLE = ANSWER?.title;
        retVal.push(ANSWER_TITLE + DOUBLE_LINE_BREAK);
        const ANSWER_TEXT = _htmlToText(ANSWER?.text, docDef);
        retVal = [...retVal, ...ANSWER_TEXT];
        retVal.push(DOUBLE_LINE_BREAK);
      }
    } 
    return retVal;
  } catch (error) {
    _throwError(error, _getTransformedMessage.name);
  }
}

const _htmlToText = (html, docDef) => {
  try {
    const TABLE = [];
    let retVal = [];
    let isLink = false;
    let isTable = false;
    let columnNum = 0;
    let link = '';

    const PARSER = new htmlparser2.Parser({
      onopentag(name, attributes) {
        if (name === HTML_TAGS.HYPERLINK) {
          isLink = true;
          link = attributes.href;
        }
        if (name === HTML_TAGS.HEADER && attributes.scope === HTML_TAGS.SCOPE) {
          isTable = true;
          columnNum += 1;
          retVal.push('');
        }
      },
      ontext(text) {
        if (text && text.trim().length > 0) {
          if (isLink) {
            retVal.push(_getContentLink(text, link, VALID_STYLES.LINK));
            isLink = false;
          } else if (isTable) {
            TABLE.push(text);
          } else {
            retVal.push(text);
          }
        }
      },
    });
    PARSER.write(html);
    PARSER.end();

    if(isTable){
      _addContentTable(TABLE, columnNum, docDef);
    }
    return retVal;
  } catch (error) {
    _throwError(error, _htmlToText.name);
  }
}

const _addContentTable = (table, columnNum, docDef) => {
  const BLOCK = [];
  let row = [];
  for (var i = 0; i < table.length; i++) {
    row.push(table[i]);
    if(row.length === columnNum){
      BLOCK.push(row);
      row = [];
    }
  }  
  const BODY = {
    body: BLOCK
  }
  addContentTable(BODY, VALID_STYLES.TABLE, docDef);
}

const _getContentLink = (text, link, style) => {
  const RET_VAL = {
    text: text, 		    
    link: link,
    style: style
  };
  return RET_VAL;
};

const _addHeader = (configuration, documentDefinition) => {
  try {
    const ASSISTANT_NAME = configuration?.assistantDisplayName;
    const DATE = _formatHeaderDate(configuration?.user?.piConfirmation?.timestamp);
    const USER_NAME = configuration?.user?.firstName + ' ' + configuration?.user?.lastName;
    const EMAIL = configuration?.user?.email;
    const PROFILE = HEADER.DATE + DATE + HEADER.DELIMITER + HEADER.USER_NAME + USER_NAME + HEADER.DELIMITER + HEADER.EMAIL + EMAIL;
    const TITLE = HEADER.TITLE + ASSISTANT_NAME;
    
    addContentText(PROFILE, VALID_STYLES.PROFILE, documentDefinition);
    addContentText(TITLE, VALID_STYLES.TITLE, documentDefinition);
  } catch (error) {
    _throwError(error, _addHeader.name);
  }
};

const _throwError = (error, functionName) => {
  const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
  appendDataToError(ACA_ERROR, { functionName });
  logger.error({ ACA_ERROR });
  throw ACA_ERROR;
};

export {
  downloadOne,
};
