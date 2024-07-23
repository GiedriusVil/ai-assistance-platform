/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    configurationLocalSyncEnabled: Joi.boolean(),
  }),
  Joi.boolean()
);

export {
  SCHEMA,
}
