/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-controller-rules-messages-import-upload';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { xlsToMessages } = require('@ibm-aiap/aiap-utils-xlsx');
const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const {
  rulesMessagesService,
  rulesMessagesImportService,
} = require('@ibm-aca/aca-rules-service');

const uploadFile = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const ACTION = {
    create: 'CREATE',
    update: 'UPDATE',
    delete: 'DELETE'
  };
  let result;

  try {
    if (lodash.isEmpty(ERRORS)) {
      const IMPORT_FILE = ramda.path(['files', 'messagesFile'], request);

      const MESSAGE_ITEMS = await xlsToMessages(CONTEXT, IMPORT_FILE);
      const PROMISES = [];

      if (!lodash.isEmpty(MESSAGE_ITEMS)) {
        const DELETE_MESSAGE_ITEMS = MESSAGE_ITEMS.filter(messageItem => messageItem.action === ACTION.delete);
        if (!lodash.isEmpty(DELETE_MESSAGE_ITEMS)) {
          DELETE_MESSAGE_ITEMS.forEach(messageItem => rulesMessagesService.deleteOneById(CONTEXT, messageItem.message));
        }

        const CREATE_UPDATE_MESSAGE_ITEMS = MESSAGE_ITEMS.filter(
          messageItem => messageItem.action === ACTION.create || messageItem.action === ACTION.update);
        if (!lodash.isEmpty(CREATE_UPDATE_MESSAGE_ITEMS)) {
          CREATE_UPDATE_MESSAGE_ITEMS.forEach(messageItem => {
            PROMISES.push(rulesMessagesImportService.saveOne(CONTEXT, messageItem));
          });
        }
      }
      result = await Promise.all(PROMISES);
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(400).json(ERRORS);
  }
};

module.exports = {
  uploadFile,
};
