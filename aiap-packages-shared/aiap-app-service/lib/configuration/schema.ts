/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

export const DEFAULT_SERVICE_SCHEMA = Joi.alternatives().try(
  Joi.object({
    configurationLocalSyncEnabled: Joi.boolean(),
    externalAccessGroupsSyncEnabled: Joi.boolean(),
    default: {
      accessGroups: Joi.boolean(),
    },
  }),
  Joi.boolean()
);
