/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const GENESYS_SCHEMA = Joi.object({
  uri: Joi.string().required(),
  skill: Joi.string().required(),
  environment: Joi.string().required(),
  service: Joi.string().required(),
  action: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    version: Joi.string().required(),
    channelId: Joi.string().required(),
    channelParams: Joi.array().items(GENESYS_SCHEMA),
  }),
  Joi.boolean()
);

export {
  SCHEMA
};
