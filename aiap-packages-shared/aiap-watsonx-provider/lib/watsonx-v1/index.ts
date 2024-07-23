/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watsonx-provider-watsonx-v1';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, createAcaError } from '@ibm-aca/aca-utils-errors';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IWatsonxV1ConfigurationExternal, ITranslateTextParamsV1 } from './types';
import { AiapWatsonx } from '../watsonx';
import { _translation } from './translation';

class AiapWatsonxV1 extends AiapWatsonx {

  config: IWatsonxV1ConfigurationExternal;
  version: string;
  url: string;
  endpoint: string;
  authType: string;
  username: string;
  password: string;
  apiKey: string;
  iamTokenUrl: string;
  headers: any;

  constructor(
    config: IWatsonxV1ConfigurationExternal
  ) {
    super();
    this._init(config);
  }

  _init(
    config: IWatsonxV1ConfigurationExternal
  ) {
    try {
      this.config = config;
      this.version = this.config?.version;
      this.url = this.config?.url;
      this.endpoint = this.config?.endpoint;
      this.authType = this.config?.authType;
      this.username = this.config?.username;
      this.password = this.config?.password;
      const ERRORS = this._isWatsonxConfigurationValid();
      if (
        !lodash.isEmpty(ERRORS)
      ) {
        const MESSAGE = `Multiple configuration errors identified!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { ERRORS });
      }
      if (
        this.authType === 'iam' &&
        this.username === 'apikey'
      ) {
        this.apiKey = this.password;
        this.iamTokenUrl = this.config?.iamTokenUrl;
      }
      this.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_init', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _isWatsonxConfigurationValid() {
    const ERRORS = [];
    if (
      lodash.isEmpty(this.config)
    ) {
      const MESSAGE = `Missing mandatory config parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.version)
    ) {
      const MESSAGE = `Missing mandatory config.version parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.authType)
    ) {
      const MESSAGE = `Missing mandatory config.authType parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.url)
    ) {
      const MESSAGE = `Missing mandatory config.url parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.endpoint)
    ) {
      const MESSAGE = `Missing mandatory config.endpoint parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.username)
    ) {
      const MESSAGE = `Missing mandatory config.username parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.password)
    ) {
      const MESSAGE = `Missing mandatory config.password parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    return ERRORS;
  }

  get translation() {
    const RET_VAL = {
      translateText: async (
        context: IContextV1,
        params: ITranslateTextParamsV1,
      ) => {
        return _translation.translateText(this, context, params);
      }
    }
    return RET_VAL;
  }

}

export {
  AiapWatsonxV1,
};
