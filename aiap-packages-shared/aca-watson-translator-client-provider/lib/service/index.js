/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-translator-client-provider-WT-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const WTServiceEndpoint = require('../endpoints/WTService-endpoint');

class WTV3Service {

  constructor(config) {
    this.config = config;
    this.endpoints = [];
  }

  async init() {
    const SERVICES_CONFIGURATION = ramda.path(['service'], this.config);
    if (Array.isArray(SERVICES_CONFIGURATION)) {
      SERVICES_CONFIGURATION.forEach(serviceConfiguration => {
        let serviceEndpoint = WTServiceEndpoint(serviceConfiguration, this.config);
        this.endpoints.push(serviceEndpoint);
      });
    }
  }

  async getIdentifiableLangauges(serviceId) {
    const SERVICE = this.__getEndpointByID(serviceId);
    try {
      if (!SERVICE) {
        const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RESULT = await SERVICE.getIdentifiableLangauges();
      return RESULT;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getIdentifiableLangauges', ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  async getTextLanguage(serviceId, params) {
    const SERVICE = this.__getEndpointByID(serviceId);
    try {
      if (!SERVICE) {
        const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RESULT = await SERVICE.getTextLanguage(params);
      return RESULT;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTextLanguage', ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  async getTextTranslation(serviceId, params) {
    const SERVICE = this.__getEndpointByID(serviceId);
    try {
      if (!SERVICE) {
        const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RESULT = await SERVICE.getTextTranslation(params);
      return RESULT;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTextTranslation', ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  async getTranslationModelsList(serviceId) {
    const SERVICE = this.__getEndpointByID(serviceId);
    try {
      if (!SERVICE) {
        const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RESULT = await SERVICE.getTranslationModelsList();
      return RESULT;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTranslationModelsList', ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  async getTranslationModelDetails(serviceId, params) {
    const SERVICE = this.__getEndpointByID(serviceId);
    try {
      if (!SERVICE) {
        const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RESULT = await SERVICE.getTranslationModelDetails(params);
      return RESULT;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('getTranslationModelDetails', ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  // /**
  //  * Get endpoint by Id or default if no requested id provided
  //  * @param endpointId
  //  * @returns {*}
  //  */
  __getEndpointByID(endpointId) {
    return this.endpoints.find(element => {
      return endpointId == null ? element.config.defaultEndpoint : element.config.id === endpointId;
    });
  }
}

module.exports = {
  WTV3Service
}
