/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-organizations-releases-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { throwAcaError, formatIntoAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.organizationsReleases;
  let release;
  let releaseId;
  let filter;
  let update;
  let updateOptions;
  try {
    release = params?.release;
    if (
      lodash.isEmpty(release)
    ) {
      const MESSAGE = `Missing required params.release parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    releaseId = ramda.pathOr(uuidv4(), ['id'], release);
    if (
      !validator.isMongoId(releaseId) &&
      !validator.isAlphanumeric(releaseId, 'en-US', { ignore: '_-' })
    ) {
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Invalid params.releaseId.id attribute!');
    }
    filter = { _id: releaseId }
    update = { $set: release };
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

    release.id = releaseId;
    return release;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
