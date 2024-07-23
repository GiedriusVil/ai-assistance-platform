/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const CHAT_REST_SERVER_SHEMA = Joi.object({
  tenant: {
      id: Joi.string().required(),
  },
  assistant: {
      id: Joi.string().required(),
  },
  engagement: {
      id: Joi.string().required(),
  },
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
      servers: Joi.array().items(CHAT_REST_SERVER_SHEMA),
  }),
  Joi.boolean()
);

export {
  SCHEMA,
};
