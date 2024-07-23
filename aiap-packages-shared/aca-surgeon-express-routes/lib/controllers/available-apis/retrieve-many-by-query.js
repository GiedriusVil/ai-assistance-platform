/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-surgeon-express-routes-available-apis-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAppFromStorage } = require('../../runtime-storage');

const { getEndpoints } = require('../../list-express-endpoints');


const retrieveManyByQuery = async (request, response) => {
  const ERRORS = [];


  let endpoints;
  let result;
  try {
    result = [];
    const APP = getAppFromStorage();
    endpoints = getEndpoints(APP);
    if (
      lodash.isArray(endpoints)
    ) {
      for (let endpoint of endpoints) {
        let tmpEndpoint = {
          path: endpoint?.path,
          methods: endpoint?.methods,
          middlewares: endpoint?.middlewares,
        };
        result.push(tmpEndpoint);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(`${retrieveManyByQuery.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  retrieveManyByQuery,
};
