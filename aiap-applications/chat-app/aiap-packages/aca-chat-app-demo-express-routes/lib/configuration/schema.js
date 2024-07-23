/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const ENGAGEMENTS_FILTER = Joi.alternatives().try(Joi.object({
  skip: {
    environments: Joi.array(),
  }
}), Joi.boolean());



const SCHEMA = Joi.alternatives().try(
  Joi.boolean(),
  Joi.object({
    engagementsFilter: ENGAGEMENTS_FILTER,
    userProfileMockEnabled: Joi.boolean(),
  })
);

module.exports = {
  SCHEMA,
};
