/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-28-transform-record-retrieve-conversation-by-id';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const retrieveConversationById = async (configuration, db, id) => {
  let collection;
  let retVal;
  try {
    collection = configuration?.app?.collections.conversations;
    if (
      lodash.isEmpty(collection)
    ) {
      const ERROR_MESSAGE = `Missing required configuration?.app?.collections.conversations parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(id)
    ) {
      const ERROR_MESSAGE = `Missing required id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    retVal = await db.collection(collection).findOne({ _id: id })
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(retrieveConversationById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  retrieveConversationById,
}
