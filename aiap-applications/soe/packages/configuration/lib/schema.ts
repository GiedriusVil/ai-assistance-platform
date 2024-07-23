/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

import { attachEternalLibsSchemas } from './external-configurations';

const SOE_SCHEMA = {
  logger: {
    debug: Joi.string(),
    enablePrettifier: Joi.boolean().required(),
  },
};

let schema = Joi.object(SOE_SCHEMA);

schema = attachEternalLibsSchemas(schema);

export {
  schema,
}
