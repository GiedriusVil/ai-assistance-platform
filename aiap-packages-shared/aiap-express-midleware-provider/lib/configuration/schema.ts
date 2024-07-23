/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const BASIC_AUTHENTICATION_WARE_USER_SCHEMA = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const BASIC_AUTHENTICATION_WARE_SCHEMA = Joi.alternatives().try(
  Joi.object({
    users: Joi.array().items(BASIC_AUTHENTICATION_WARE_USER_SCHEMA)
  }),
  Joi.boolean(),
);

const FORMIDABLE_WARE_SCHEMA = Joi.alternatives().try(
  Joi.object({
    options: Joi.object({
      maxFileSize: Joi.number(),
    }),
  }),
  Joi.boolean(),
)

export const SCHEMA = Joi.alternatives().try(
  Joi.object({
    basicAuthenticationWare: BASIC_AUTHENTICATION_WARE_SCHEMA,
    formidableWare: FORMIDABLE_WARE_SCHEMA,
  }),
  Joi.boolean()
)
