/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SSO_SCHEMA = Joi.alternatives().try(
  Joi.object({
    clientId: Joi.string(),
    redirectUrl: Joi.string(),
    scope: Joi.string(),
    loginUrl: Joi.string(),
    responseType: Joi.string(),
    jwkEndpoint: Joi.string(),
  }),
  Joi.boolean(),
);

const APP_SCHEMA = Joi.object({
  auth: {
    sso: SSO_SCHEMA
  },
  port: Joi.number().required(),
  domainVerificationPath: Joi.string().optional(),
  options: {
    widgetEnabled: Joi.string(),
  },
  userLoginFailiureLimit: Joi.number().required(),
  passwordPolicyRotation: Joi.number().required(),
  passwordPolicyRegexp: Joi.string().required(),
  passwordPolicyMessage: Joi.string().required(),
  changeLogs: {
    accessGroupsChangesEnabled: Joi.boolean().required(),
    assistantsChangesEnabled: Joi.boolean().required(),
    applicationsChangesEnabled: Joi.boolean().required(),
    tenantsChangesEnabled: Joi.boolean().required(),
    usersChangesEnabled: Joi.boolean().required(),
  },
  userIdleService: {
    idle: Joi.number().required(),
    timeout: Joi.number().required(),
    ping: Joi.number(),
    idleSensitivity: Joi.number(),
  },
});

export {
  APP_SCHEMA,
};
