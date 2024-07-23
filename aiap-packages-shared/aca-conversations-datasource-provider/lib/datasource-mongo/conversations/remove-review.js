/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-conversations-remove-review';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const removeReview = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.conversations;

  let filter;
  let updateCondition;
  const ID = ramda.path(['id'], params);
  if (lodash.isEmpty(ID)) {
    const MESSAGE = (`Missing required params.id attribute`);
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }

  const USER = ramda.path(['user', 'id'], context);
  try {
    filter = { _id: ID };
    updateCondition = {
      $pull: {
        'reviewed':
        {
          'userId': USER
        }
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition
        });

    return RESPONSE;
  }
  catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, updateCondition });
    logger.error(removeReview.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  removeReview
}
