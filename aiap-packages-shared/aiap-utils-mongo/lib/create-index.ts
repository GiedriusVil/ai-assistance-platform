import { ACA_ERROR_TYPE, appendDataToError, throwAcaError } from "@ibm-aca/aca-utils-errors";

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-mongo-utils-create-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ReadPreference,
  Db,
  IndexSpecification,
  CreateIndexesOptions,
} from 'mongodb';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const createIndex = async (
  db: Db,
  collection: string,
  index: IndexSpecification,
  options: CreateIndexesOptions = null,
) => {
  try {
    if (
      lodash.isEmpty(db) ||
      lodash.isEmpty(collection) ||
      lodash.isEmpty(index)
    ) {
      const ERROR_MESSAGE = `Missing one or more required db || collection || index parameters!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const RET_VAL = await db
      .collection(
        collection,
        {
          readPreference: ReadPreference.PRIMARY,
        })
      .createIndex(index, options);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { collection, index, options });
    logger.error(createIndex.name, { ACA_ERROR });
  }
}

export {
  createIndex,
}
