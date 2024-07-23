/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { isStringTrue } from '../utils';
import { AppConfiguration } from '../types';

const transformAppConfiguration = async (rawConfiguration: any) => {
  const RET_VAL: AppConfiguration = {
    auth: {
      sso: isStringTrue(rawConfiguration.AIAP_SSO_W3ID_ENABLED) && {
        clientId: rawConfiguration.AIAP_SSO_W3ID_CLIENT_ID,
        redirectUrl: rawConfiguration.AIAP_SSO_W3ID_REDIRECT_URL,
        scope: rawConfiguration.AIAP_SSO_W3ID_SCOPE,
        loginUrl: rawConfiguration.AIAP_SSO_W3ID_LOGIN_URL,
        responseType: rawConfiguration.AIAP_SSO_W3ID_RESPONSE_TYPE,
        jwkEndpoint: rawConfiguration.AIAP_SSO_W3ID_JWK_ENDPOINT,
      },
    },
    port: rawConfiguration.PORT || 3002,
    domainVerificationPath: rawConfiguration.DOMAIN_VERIFICATION_PATH,
    options: {
      widgetEnabled: rawConfiguration.CHAT_WIDGET_ENABLED || 'true',
    },
    userLoginFailiureLimit: rawConfiguration.USER_LOGIN_FAILURE_LIMIT,
    passwordPolicyRotation: rawConfiguration.PASSWORD_POLICY_ROTATION,
    passwordPolicyRegexp: rawConfiguration.PASSWORD_POLICY_REGEXP,
    passwordPolicyMessage: rawConfiguration.PASSWORD_POLICY_MESSAGE,
    changeLogs: {
      accessGroupsChangesEnabled: rawConfiguration.ACCESS_GROUPS_CHANGES_ENABLED || true,
      assistantsChangesEnabled: rawConfiguration.ASSISTANTS_CHANGES_ENABLED || true,
      applicationsChangesEnabled: rawConfiguration.APPLICATIONS_CHANGES_ENABLED || true,
      tenantsChangesEnabled: rawConfiguration.TENANTS_CHANGES_ENABLED || true,
      usersChangesEnabled: rawConfiguration.USERS_CHANGES_ENABLED || true,
    },
    userIdleService: {
      idle: rawConfiguration.USER_IDLE_SERVICE_ALLOWED_IDLE_TIME_SEC || 600,
      timeout: rawConfiguration.USER_IDLE_SERVICE_TIMEOUT_SEC || 120,
      ping: rawConfiguration.USER_IDLE_SERVICE_PING_SEC || 30,
      idleSensitivity: rawConfiguration.USER_IDLE_SERVICE_IDLE_SENSITIVITY_SEC || 20,
    }
  };
  return RET_VAL;
}

export {
  transformAppConfiguration,
}
