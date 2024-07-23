/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const IBM_BOX_CONNECTOR_SCHEMA = Joi.object({
  id: Joi.string().required(),
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  clientUrl: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    connectors: Joi.array().items(IBM_BOX_CONNECTOR_SCHEMA),
  }),
  Joi.boolean(),
);

module.exports = {
  SCHEMA,
};
