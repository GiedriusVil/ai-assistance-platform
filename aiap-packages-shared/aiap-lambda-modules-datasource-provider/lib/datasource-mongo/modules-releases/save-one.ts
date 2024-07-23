/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-releases-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';
import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import { 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import { findOneById } from './find-one-by-id';

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.modulesReleases;
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

    const RET_VAL = await findOneById(datasource, context, { id: releaseId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
};
