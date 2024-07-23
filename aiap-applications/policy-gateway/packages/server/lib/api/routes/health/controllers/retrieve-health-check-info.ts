/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-policy-gateway-controller-health-retrieve-health-check-info';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getMongoClients } from '@ibm-aiap/aiap-mongo-client-provider';

const retrieveHealthCheckInfo = async (req, res) => {
  const ERRORS = [];
  const RESPONSE = {
    mongo: {
      clients: []
    }
  };
  try {
    const MONGO_CLIENTS = getMongoClients({ user: { session: {} } });
    if (
      !lodash.isEmpty(MONGO_CLIENTS)
    ) {
      for (const KEY of Object.keys(MONGO_CLIENTS)) {
        const MONGO_CLIENT = MONGO_CLIENTS[KEY];
        const STATUS = MONGO_CLIENT.status();
        RESPONSE.mongo.clients.push({
          name: KEY,
          status: STATUS
        });
      }
    }
  } catch (err) {
    ERRORS.push({
      code: 'SYSTEM_ERROR',
      error: err,
      text: `${err}`
    });
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    logger.info('RESPONSE:', { RESPONSE });
    res.status(200).json(RESPONSE);
  } else {
    logger.info('ERRORS:', { errors: ERRORS });
    res.status(500).json(ERRORS);
  }
};

export {
  retrieveHealthCheckInfo,
};
