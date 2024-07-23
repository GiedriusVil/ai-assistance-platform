/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const { APP_SCHEMA } = require('./application/schema');
const { attachEternalLibsSchemas } = require('./external-configurations');

let schema = Joi.object({
  logger: {
    debug: Joi.string(),
    enablePrettifier: Joi.boolean().required(),
  },
  app: APP_SCHEMA,
});

schema = attachEternalLibsSchemas(schema);

module.exports = schema;
