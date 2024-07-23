export interface AppConfiguration {
  auth: {
    sso: boolean | {
      clientId: string,
      redirectUrl: string,
      scope: string,
      loginUrl: string,
      responseType: string,
      jwkEndpoint: string,
    },
  },
  port: number,
  domainVerificationPath: string,
  options: {
    widgetEnabled: string,
  },
  userLoginFailiureLimit: string,
  passwordPolicyRotation: string,
  passwordPolicyRegexp: string,
  passwordPolicyMessage: string,
  changeLogs: {
    accessGroupsChangesEnabled: boolean,
    assistantsChangesEnabled: boolean,
    applicationsChangesEnabled: boolean,
    tenantsChangesEnabled: boolean,
    usersChangesEnabled: boolean,
  },
  userIdleService: {
    idle: number,
    timeout: number,
    ping: number,
    idleSensitivity: number,
  }
}

export interface SecretProvidersConfig {
  keyProtect: false | {
    iamAPIKey: string,
    iamAPITokenURL: string,
    passphrase: string,
    keyProtectInstanceID: string,
    keyProtectURL: string,
    keyID: string,
    salt1?: string,
    salt2?: string,
  }
}
