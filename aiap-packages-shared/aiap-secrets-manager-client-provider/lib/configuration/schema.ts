/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const CONNECTION_SCHEMA = Joi.object({
  name: Joi.string().required(),
  options: {
    url: Joi.string().required(),
    version: Joi.string(),
  }
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    clients: Joi.array().items(CONNECTION_SCHEMA)
  }),
  Joi.boolean()
);

export {
  SCHEMA
};
