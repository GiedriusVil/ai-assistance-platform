/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const OBJECT_STORAGE_CLIENT_SCHEMA = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    endPoint: Joi.string().required(),
    port: Joi.string().required(),
    accessKey: Joi.string().required(),
    secretKey: Joi.string(),
  }),
  Joi.boolean(),
);

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    clients: Joi.array().items(OBJECT_STORAGE_CLIENT_SCHEMA)
  }),
  Joi.boolean(),
);

export {
  SCHEMA,
}
