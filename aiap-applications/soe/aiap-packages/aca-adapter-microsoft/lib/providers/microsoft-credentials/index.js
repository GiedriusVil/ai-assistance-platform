/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-credentials-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { MicrosoftAppCredentials, SimpleCredentialProvider } = require('botframework-connector');

const CREDENTIALS = {};

const initMicrosoftCredentials = (sourceConfig) => {
   const APP_ID = ramda.path(['appId'], sourceConfig);
   const CREDENTIAL = new MicrosoftCredentialsProvider(sourceConfig);
   CREDENTIALS[APP_ID] = CREDENTIAL;
};

const initMicrosoftCredentialsProvider = (CONFIG) => {
   const SOURCES_CONFIG = ramda.path(['credentials'], CONFIG);
   if (
      !lodash.isEmpty(SOURCES_CONFIG) &&
      lodash.isArray(SOURCES_CONFIG)
   ) {
      for (let sourceConfig of SOURCES_CONFIG) {
         initMicrosoftCredentials(sourceConfig);
      }
      logger.info('INITIALIZED');
   } else {
      logger.warn(`[${MODULE_ID}] Missing Microsoft Adapter configuration!`);
   }
};

const getMicrosoftCredentialsByAppId = (appId) => {
   const RET_VAL = CREDENTIALS[appId];
   return RET_VAL;
};

const getMicrosoftCredentials = (context) => {
   return CREDENTIALS;
};

class MicrosoftCredentialsProvider {

   constructor(settings) {
      this.settings = { appId: '', appPassword: '', ...settings };

      this.credentials = new MicrosoftAppCredentials(
         this.settings.appId,
         this.settings.appPassword || '',
         this.settings.channelAuthTenant
      );
      this.credentialsProvider = new SimpleCredentialProvider(
         this.credentials.appId,
         this.settings.appPassword || ''
      );
   }

}

module.exports = {
   MicrosoftCredentialsProvider,
   initMicrosoftCredentialsProvider,
   getMicrosoftCredentialsByAppId,
   getMicrosoftCredentials,
};
