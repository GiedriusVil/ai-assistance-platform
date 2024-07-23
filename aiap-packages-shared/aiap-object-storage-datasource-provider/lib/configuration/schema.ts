/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const OBJECT_STORAGE_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    bucketsChanges: Joi.string().required(),
    buckets: Joi.string().required(),
    filesChanges: Joi.string().required(),
    files: Joi.string().required(),
  }
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(OBJECT_STORAGE_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

export {
  SCHEMA,
}
