/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
/* eslint no-console: "off" */
const MODULE_ID = 'aiap-policy-engine-server-controllers-health'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getMongoClients } from '@ibm-aiap/aiap-mongo-client-provider';
import { getAcaRulesDatasources } from '@ibm-aca/aca-rules-datasource-provider';

const retrieveHealth = async (req, res) => {
  const ERRORS = [];
  const RESPONSE = {
    mongo: {
      clients: []
    },
    datasources: {
      rules: []
    }
  };
  try {
    const MONGO_CLIENTS = getMongoClients({ user: { session: {} } });
    if (!lodash.isEmpty(MONGO_CLIENTS)) {
      for (const KEY of Object.keys(MONGO_CLIENTS)) {
        const MONGO_CLIENT = MONGO_CLIENTS[KEY];
        const STATUS = MONGO_CLIENT.status();
        RESPONSE.mongo.clients.push({
          name: KEY,
          status: STATUS
        });
      }
    }

    const RULES_DATASOURCES = getAcaRulesDatasources();
    if (
      !lodash.isEmpty(RULES_DATASOURCES)
    ) {
      for (const key of Object.keys(RULES_DATASOURCES)) {
        const datasource = RULES_DATASOURCES[key];
        RESPONSE.datasources.rules.push({
          name: key,
          type: datasource.type,
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
}

export {
  retrieveHealth,
};
