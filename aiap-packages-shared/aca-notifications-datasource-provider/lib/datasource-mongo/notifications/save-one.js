
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-notifications-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.notifications;
  let notification;
  let notificationId;
  let filter;
  let update;
  let updateOptions;
  try {
    notification = params?.notification;
    if (lodash.isEmpty(notification)) {
      const MESSAGE = 'Missing required parameter notification!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    notificationId = ramda.pathOr(uuidv4(), ['id'], notification);
    if (
      lodash.isEmpty(notificationId)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !validator.isMongoId(notificationId) &&
      !validator.isAlphanumeric(notificationId, 'en-US', { ignore: '_-' })
    ) {
      const VALIDATION_MESSAGE = 'Mandatory parameter id invalid!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, VALIDATION_MESSAGE);
    }

    appendAuditInfo(context, notification);

    filter = { _id: notificationId };
    update = { $set: notification };
    updateOptions = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: update,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: notificationId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
