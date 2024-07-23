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
        message: '§§TRANSFER',
        _processed_2022_11_16: {
          $ne: true
        }
      }
    };
    const LIMIT = {
      $limit: config.app.bulkSize
    }

    const LOOKUP_UTTERANCES = {
      $lookup: {
        from: config.app.collections.utterances,
        localField: 'utteranceId',
        foreignField: '_id',
        as: 'utterance',
      }
    };

    const UNWIND = {
      $unwind: '$utterance'
    }

  
    const PIPELINE = [
      MATCHER,
      LIMIT,
      LOOKUP_UTTERANCES,
      UNWIND,
    ];
    retVal = await db.collection(config.app.collections.messages).aggregate(PIPELINE).toArray();
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
