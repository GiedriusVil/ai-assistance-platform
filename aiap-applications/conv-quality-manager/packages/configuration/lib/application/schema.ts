/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const APP_SCHEMA = Joi.object({
  port: Joi.number().required(),
  transports: Joi.string()
});

export {
  APP_SCHEMA
}
