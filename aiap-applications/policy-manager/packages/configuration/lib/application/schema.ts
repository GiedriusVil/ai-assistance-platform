/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const APP_SCHEMA = Joi.object({
  users: {
    admin: {
      userName: Joi.string().required(),
      userPass: Joi.string().required(),
    },
    firstUser: {
      userName: Joi.string().required(),
      userPass: Joi.string().required(),
    },
    secondUser: {
      userName: Joi.string().required(),
      userPass: Joi.string().required(),
    },
    adminTestUser: Joi.alternatives().try(
      Joi.object({
        userName: Joi.string().required(),
        userPass: Joi.string().required(),
      }),
      Joi.boolean()
    ),
  },
  port: Joi.number().required(),
  options: {
    widgetEnabled: Joi.string(),
  },
});

export {
  APP_SCHEMA,
}
