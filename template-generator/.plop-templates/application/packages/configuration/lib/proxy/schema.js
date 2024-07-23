/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const PROXY_SCHEMA = Joi.object({
    analytics: {
      aggregated: {
        url: Joi.string(),
        basePath: Joi.string(),
        apiKey: Joi.string(),
        apiSecret: Joi.string(),
        tenantId: Joi.string(),
      },
    },
});

module.exports = {
    PROXY_SCHEMA
};
