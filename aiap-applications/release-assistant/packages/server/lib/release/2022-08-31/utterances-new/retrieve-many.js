/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-retrieve-many';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveMany = async (config, db) => {
  let retVal;
  try {
    const MATCHER = {
      $match: {
        _processed_2022_08_31: {
          $ne: true
        }
      }
    };
    const LIMIT = {
      $limit: config.app.bulkSize
    }
    const LOOKUP_INTENTS = {
      $lookup: {
        from: config.app.collections.intents,
        localField: '_id',
        foreignField: 'utteranceId',
        as: 'intents'
      }
    };
    const LOOKUP_ENTITIES = {
      $lookup: {
        from: config.app.collections.entities,
        localField: '_id',
        foreignField: 'utteranceId',
        as: 'entities',
      }
    };
    const PIPELINE = [
      MATCHER,
      LIMIT,
      LOOKUP_INTENTS,
      LOOKUP_ENTITIES,
    ];
    retVal = await db.collection(config.app.collections.utterances).aggregate(PIPELINE).toArray();
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(retrieveMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  retrieveMany,
}
