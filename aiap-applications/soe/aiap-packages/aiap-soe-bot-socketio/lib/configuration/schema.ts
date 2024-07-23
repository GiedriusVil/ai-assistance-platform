/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA_SETTINGS = Joi.alternatives().try(
  Joi.object({
    id: Joi.string().required(),
    agent: Joi.string(),
    requireRole: Joi.string().required(),
    path: Joi.string(),
    authProvider: Joi.object({
      host: Joi.string().required(),
    }),
    session: Joi.object({
      expiration: Joi.number().default(7200000),
    }),
    typingOffDelay: Joi.number().default(1500),
    activity: Joi.object({
      close: Joi.alternatives().try(
        Joi.object({
          inactivityTime: Joi.number().default(1800000),
          closingStateTime: Joi.number().default(1800000),
        }),
        Joi.boolean().falsy()
      ),
      message: Joi.alternatives().try(
        Joi.object({
          message: Joi.string().required(),
          inactivityTime: Joi.number().default(300000),
        }),
        Joi.boolean().falsy()
      ),
    }),
  }),
  Joi.boolean()
);

const SCHEMA_SOCKETIO_SERVER = Joi.alternatives().try(
  Joi.object({
    cookie: Joi.boolean(),
    path: Joi.string(),
    transports: Joi.array(),
    allowUpgrades: Joi.boolean(),
    pingTimeout: Joi.number(),
    pingInterval: Joi.number(),
  }),
  Joi.boolean()
);

const SCHEMA = Joi.alternatives().try(Joi.object({
  settings: SCHEMA_SETTINGS,
  socketIoServerOptions: SCHEMA_SOCKETIO_SERVER,
}), Joi.boolean());

export {
  SCHEMA,
}
