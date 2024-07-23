/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-cos-instance';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const aws = require('ibm-cos-sdk');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

class AcaCosInstance {
  constructor(config) {
    this.config = config;
    this._instance = undefined;
  }

  async initialize() {
    try {
      const OPTIONS = ramda.path(['options'], this.config);

      const ENDPOINT = new aws.Endpoint(OPTIONS.endpoint);
      const PARAMS = {
        endpoint: ENDPOINT,
        region: OPTIONS.region,
        apiKeyId: OPTIONS.apiKey,
        serviceInstanceId: OPTIONS.id,
        signatureVersion: 'iam',
      };

      this._instance = new aws.S3(PARAMS);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  instance() {
    return this._instance;
  }
}

module.exports = {
  AcaCosInstance
};
