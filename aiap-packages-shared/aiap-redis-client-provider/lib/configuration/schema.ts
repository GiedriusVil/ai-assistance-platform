/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const REDIS_CLIENT_SCHEMA = Joi.alternatives().try(
  Joi.object({
    type: Joi.string().required(),
    url: Joi.string().required(),
    password: Joi.string(),
    name: Joi.string().default(''),
    keyPrefix: Joi.string(),
    tls: Joi.alternatives().try(
      Joi.object({
        serverName: Joi.string(),
        strictSSL: Joi.boolean(),
        pfx: Joi.object({
          pfx: Joi.string(),
          passphrase: Joi.string(),
        }),
        cert: Joi.object({
          cert: Joi.string(),
          key: Joi.string(),
          passphrase: Joi.string(),
          ca: Joi.string(),
        }),
      }),
      Joi.boolean().falsy()
    ),
    sentinels: Joi.alternatives().try(Joi.array().items(), Joi.boolean()),
    encryption: Joi.alternatives().try(
      Joi.object({
        key: Joi.string().required(),
        hmacKey: Joi.string().required(),
      }),
      Joi.boolean()
    ),
    cluster: Joi.alternatives().try(
      Joi.object({
        hosts: Joi.array()
          .items(Joi.string())
          .min(1),
      }),
      Joi.boolean()
    ),
  }),
  Joi.boolean(),
);

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    clients: Joi.array().items(REDIS_CLIENT_SCHEMA)
  }),
  Joi.boolean(),
);

export {
  SCHEMA,
}
