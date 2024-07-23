/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const MONGO_CONNECTION_SCHEMA = Joi.object({
  name: Joi.string().required(),
  options: {
    uri: Joi.string().required(),
    name: Joi.string().required(),
    ssl: Joi.alternatives().try(
      Joi.object({
        cert: Joi.string().optional(),
      }),
      Joi.boolean()
    ),
    sslValidate: Joi.boolean().optional(),
    proxyHost: Joi.string().optional(),
    proxyPort: Joi.number().optional(),
    onlineEventTimeout: Joi.number().optional()
  }
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    methodParamsLoggerEnabled: Joi.boolean().required(),
    clients: Joi.array().items(MONGO_CONNECTION_SCHEMA)
  }),
  Joi.boolean()
);

export {
  SCHEMA,
};
