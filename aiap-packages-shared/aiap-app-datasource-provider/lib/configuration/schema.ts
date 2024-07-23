/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SCHEMA_USER = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    accessGroupId: Joi.string().required(),
  }),
  Joi.boolean(),
)

const USERS_SCHEMA = Joi.alternatives().try(
  Joi.object({
    admin: SCHEMA_USER,
    developer: SCHEMA_USER,
    tester: SCHEMA_USER,
  }),
  Joi.boolean(),
)

const SCHEMA_DATASOURCE = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  users: USERS_SCHEMA,
  collections: {
    applications: Joi.string().required(),
    applicationsChanges: Joi.string().required(),
    tenants: Joi.string().required(),
    tenantsChanges: Joi.string().required(),
    accessGroups: Joi.string().required(),
    accessGroupsChanges: Joi.string().required(),
    users: Joi.string().required(),
    usersChanges: Joi.string().required(),
  },
  defaultTenantsEnabled: Joi.boolean().required(),
  defaultAccessGroupsEnabled: Joi.boolean().required(),
  defaultEngagementsEnabled: Joi.boolean().required(),
  encryptionKey: Joi.string().required(),
});

export const SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(SCHEMA_DATASOURCE),
  }),
  Joi.boolean(),
)
