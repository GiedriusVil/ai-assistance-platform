/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SCHEMA_SECURITY = Joi.alternatives().try(
  Joi.object({
    frameguardEnabled: Joi.boolean().default(true),
    redirectToSSL: Joi.boolean().required(),
    rateLimiting: Joi.object({
      maxRequests: Joi.number().default(1000),
      windowSecs: Joi.number().default(30),
    }),
  }),
  Joi.boolean()
);

const SCHEMA_URL_REWRITE = Joi.alternatives().try(
  Joi.object({
    matchPattern: Joi.string().required(),
    replacePattern: Joi.string().required(),
  }),
  Joi.boolean()
);

const SCHEMA_SESSION = Joi.alternatives().try(
  Joi.object({
    redisClientName: Joi.string(),
  }),
  Joi.boolean()
);

const SCHEMA_CORS = Joi.alternatives().try(
  Joi.object({
    whitelist: Joi.string().required(),
  }),
  Joi.boolean()
);

const SCHEMA_BODY_PARSER = Joi.alternatives().try(
  Joi.object({
    json: {
      limit: Joi.string().required(),
    },
    urlencoded: {
      extended: Joi.boolean().required(),
      limit: Joi.string().required(),
      parameterLimit: Joi.number().required(),
    }
  }),
  Joi.boolean()
);

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    security: SCHEMA_SECURITY,
    urlRewrite: SCHEMA_URL_REWRITE,
    session: SCHEMA_SESSION,
    cors: SCHEMA_CORS,
    bodyParser: SCHEMA_BODY_PARSER,
  })
);

export {
  SCHEMA,
}
