/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const ROCKETCHAT_CHANNEL_SCHEMA = Joi.alternatives().try(
  Joi.boolean()
);

export {
  ROCKETCHAT_CHANNEL_SCHEMA,
};
