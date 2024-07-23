/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const APP_SCHEMA = Joi.object({
  wdsManagerUrl: Joi.string(),
  port: Joi.number().required(),
  options: {
    widgetEnabled: Joi.string(),
  },
});

export {
  APP_SCHEMA,
}

