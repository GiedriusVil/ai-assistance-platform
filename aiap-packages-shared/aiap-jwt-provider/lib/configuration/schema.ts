/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

export const SCHEMA = Joi.object({
  secret: Joi.string().required(),
  expiration: Joi.number().required(),
})
