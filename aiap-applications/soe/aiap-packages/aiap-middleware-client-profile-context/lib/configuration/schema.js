/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const DEFAULT_FILTERS = `firstName,secondName,lastName,country,language,loccode,company,legacyorg,sysid,emplid`;

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    filters: Joi.string().default(DEFAULT_FILTERS),
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
};
