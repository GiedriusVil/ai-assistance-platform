/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-find-utterances-stream';

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const getFindStream = async (db, params) => {
  try {
    const config = params.config;

    const MATCHER = {
      $match: {
        _processed_2022_08_31: {
          $ne: true
        }
      }
    };

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
      LOOKUP_INTENTS,
      LOOKUP_ENTITIES,
    ];

    const PARAMS = {
      collection: config.app.collections.utterances,
      collectionOptions: null,
      query: null,
      options: null,
      project: null,
      pipeline: PIPELINE
    };

    const RET_VAL = await db.collection(PARAMS.collection).aggregate(PIPELINE).batchSize(config.app.bulkSize);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(getFindStream.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  getFindStream,
};
