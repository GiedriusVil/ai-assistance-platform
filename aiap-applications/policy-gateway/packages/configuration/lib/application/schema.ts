/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const APP_SCHEMA = Joi.object({
  users: {
    admin: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    }
  },
  port: Joi.number().required(),
});

export {
  APP_SCHEMA,
}
