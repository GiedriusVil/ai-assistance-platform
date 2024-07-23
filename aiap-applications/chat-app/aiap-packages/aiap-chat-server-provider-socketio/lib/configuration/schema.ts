/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SERVER_CORS_ORIGIN_SCHEMA = Joi.object({
  origin: Joi.string(),
});

const IO_SESSION_CLIENT_SCEMA = Joi.object({
  reconnectionAttempts: Joi.number().required(),
  withCredentials: Joi.boolean().required(),
});

const IO_SESSION_SERVER_SCHEMA = Joi.alternatives().try(Joi.object({
  path: Joi.string().optional(),
  cors: Joi.alternatives().try(
    Joi.boolean(),
    Joi.object({
      origin: Joi.alternatives().try(
        Joi.array().items(SERVER_CORS_ORIGIN_SCHEMA),
        Joi.array(),
        Joi.string(),
      ).optional(),
      methods: Joi.alternatives().try(
        Joi.string(),
        Joi.array(),
      ).optional(),
      credentials: Joi.boolean().optional(),
    })
  ),
  transports: Joi.array(),
  allowUpgrades: Joi.boolean(),
  pingTimeout: Joi.number(),
  pingInterval: Joi.number(),
}), Joi.boolean());

const IO_SESSION_SCHEMA = Joi.alternatives().try(
  Joi.boolean(),
  Joi.object({
    server: IO_SESSION_SERVER_SCHEMA,
    client: IO_SESSION_CLIENT_SCEMA
  })
);

const SESSION_EXPIRATION_NOTIFIER = Joi.alternatives().try(
  Joi.boolean(),
  Joi.object({
    thresholdInSeconds: Joi.number().required(),
    waitInMs: Joi.number().required(),
    lock: {
      resource: Joi.string().required(),
      lengthInMS: Joi.number().required(),
    },
    redlock: {
      driftFactor: Joi.number().required(),
      retryCount: Joi.number().required(),
      retryDelayInMs: Joi.number().required(),
      retryJitterInMs: Joi.number().required(),
      automaticExtensionThresholdInMs: Joi.number().required(),
    }
  }),
);

const SCHEMA = Joi.alternatives().try(
  Joi.boolean(),
  Joi.object({
    ioSessionProvider: IO_SESSION_SCHEMA,
    sessionExpirationNotifier: SESSION_EXPIRATION_NOTIFIER,
  })
);

export {
  SCHEMA,
};
