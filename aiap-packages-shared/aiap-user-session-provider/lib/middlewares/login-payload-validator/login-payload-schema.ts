/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const LOGIN_PAYLOAD_SCHEMA = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

export {
  LOGIN_PAYLOAD_SCHEMA,
} 
