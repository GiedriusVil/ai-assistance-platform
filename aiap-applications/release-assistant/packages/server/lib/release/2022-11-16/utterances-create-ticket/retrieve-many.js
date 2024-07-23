/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-11-16-utterances-create-ticket-retrieve-many';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const retrieveMany = async (config, db) => {
  let retVal;
  try {
    const MATCHER = {
      $match: {
        message: '§§§CREATE_ZENDESK_TICKET_SUCCESS',
        _processed_2022_11_16: {
          $ne: true
        }
      }
    };
    const LIMIT = {
      $limit: config.app.bulkSize
    }

    const PIPELINE = [
      MATCHER,
      LIMIT,
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
