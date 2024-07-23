/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-watson-translator-client-provider-WT-service-endpoint';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  IamAuthenticator,
  LanguageTranslatorV3,
} = require('@ibm-aiap/aiap-wrapper-ibm-watson');

class WTServiceEndpoint {

  constructor(config, mainConfig) {
    this.config = config;
    this.mainConfig = mainConfig;
    this.projects = [];
    this.headers = {
      'X-Watson-Learning-Opt-Out': 'true'
    };
    if (this.config.authorizationType === 'iam') {
      this.languageTranslator = new LanguageTranslatorV3({
        version: this.config.versionDate,
        authenticator: new IamAuthenticator({ apikey: this.config.iamApiKey }),
        serviceUrl: this.config.serviceUrl,
        disableSslVerification: false,
        headers: this.headers
      });
    }
  }

  async getIdentifiableLangauges() {
    let response;
    let retVal;
    try {
      response = await this.languageTranslator.listIdentifiableLanguages();
      retVal = response?.result?.languages;
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getIdentifiableLanguages', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getTextLanguage(params) {
    let response;
    let retVal;
    try {
      response = await this.languageTranslator.identify(params);
      retVal = response?.result?.languages;
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTextLanguage', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getTextTranslation(params) {
    let response;
    let retVal;
    try {
      response = await this.languageTranslator.translate(params);
      retVal = response?.result;
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTextTranslation', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getTranslationModelsList() {
    let response;
    let retVal;
    try {
      response = await this.languageTranslator.listModels();
      retVal = response?.result;
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTranslationModelsList', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getTranslationModelDetails(params) {
    let response;
    let retVal;
    try {
      response = await this.languageTranslator.getModel(params);
      retVal = response?.result;
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { params });
      logger.error('getTranslationModelsList', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = (config, mainConfig, isDefault) => new WTServiceEndpoint(config, mainConfig, isDefault);
