/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi'

import { APP_SCHEMA } from './application/schema';
import { attachEternalLibsSchemas } from './external-configurations';

let schema = Joi.object({
  logger: {
    debug: Joi.string(),
  },
  app: APP_SCHEMA,
});

schema = attachEternalLibsSchemas(schema);

export {
  schema,
}
