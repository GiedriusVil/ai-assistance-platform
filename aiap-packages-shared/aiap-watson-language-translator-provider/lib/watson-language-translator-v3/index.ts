/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { IContextV1, IAiTranslationServiceExternalWLTV1 } from '@ibm-aiap/aiap--types-server';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, createAcaError } from '@ibm-aca/aca-utils-errors';
import {
  BasicAuthenticator,
  IamAuthenticator,
  LanguageTranslatorV3,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import { AcaWatsonLanguageTranslator } from '../watson-language-translator';
import {
  IListLanguagesParamsV1,
  ITranslateTextParamsV1,
  IListIdentifiableLanguagesParamsV1,
  IIdentifyLanguageByTextParamsV1,
  IListModelsParamsV1,
  ICreateModelParamsV1,
  IDeleteModelParamsV1,
} from './types';

import { _translation } from './translation';
import { _identification } from './identification';
import { _languages } from './languages';
import { _models } from './models';

class AcaWatsonLanguageTranslatorV3 extends AcaWatsonLanguageTranslator {

  config: IAiTranslationServiceExternalWLTV1;
  version: string;
  url: string;
  authType: string;
  username: string;
  password: string;
  authenticator: IamAuthenticator | BasicAuthenticator;
  headers: any;
  languageTranslator: LanguageTranslatorV3;

  constructor(
    config: IAiTranslationServiceExternalWLTV1
  ) {
    super();
    this._init(config);
  }

  _init(
    config: IAiTranslationServiceExternalWLTV1
  ) {
    try {
      this.config = config;
      this.version = this.config?.version;
      this.url = this.config?.url;
      this.authType = this.config?.authType;
      this.username = this.config?.username;
      this.password = this.config?.password;
      const ERRORS = this._isLanguageTranslatorConfigurationValid();
      if (
        !lodash.isEmpty(ERRORS)
      ) {
        const MESSAGE = `Multiple errors identified!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { ERRORS });
      }
      if (
        this.authType === 'iam' &&
        this.username === 'apikey'
      ) {
        this.authenticator = new IamAuthenticator({
          apikey: this.password
        });
      } else {
        this.authenticator = new BasicAuthenticator({
          username: this.username,
          password: this.password,
        });
      }
      this.headers = {
        'X-Watson-Learning-Opt-Out': 'true'
      };
      const LANGUAGE_TRANSLATOR_USER_OPTIONS = {
        version: this.version,
        serviceUrl: this.url,
        authenticator: this.authenticator,
        headers: this.headers
      };
      this.languageTranslator = new LanguageTranslatorV3(LANGUAGE_TRANSLATOR_USER_OPTIONS);
      logger.info('INITIALIZED', { LANGUAGE_TRANSLATOR_USER_OPTIONS });

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_init', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _isLanguageTranslatorConfigurationValid() {
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

  get languages() {
    const RET_VAL = {
      listLanguages: async (
        context: IContextV1,
        params: IListLanguagesParamsV1,
      ) => {
        return _languages.listLanguages(this.languageTranslator, context, params);
      }
    };
    return RET_VAL;
  }

  get translation() {
    const RET_VAL = {
      translateText: async (
        context: IContextV1,
        params: ITranslateTextParamsV1,
      ) => {
        return _translation.translateText(this.languageTranslator, context, params);
      }
    }
    return RET_VAL;
  }

  get identification() {
    const RET_VAL = {
      listIdentifiableLanguages: (
        context: IContextV1,
        params: IListIdentifiableLanguagesParamsV1,
      ) => {
        return _identification.listIdentifiableLanguages(this.languageTranslator, context, params);
      },
      identifyLanguageByText: (
        context: IContextV1,
        params: IIdentifyLanguageByTextParamsV1,
      ) => {
        return _identification.identifyLanguageByText(this.languageTranslator, context, params);
      }
    };
    return RET_VAL;
  }

  get models() {
    const RET_VAL = {
      listModels: (
        context: IContextV1,
        params: IListModelsParamsV1,
      ) => {
        return _models.listModels(this.languageTranslator, context, params);
      },
      createModel: (
        context: IContextV1,
        params: ICreateModelParamsV1,
      ) => {
        return _models.createModel(this.languageTranslator, context, params);
      },
      deleteModel: (
        context: IContextV1,
        params: IDeleteModelParamsV1,
      ) => {
        return _models.deleteModel(this.languageTranslator, context, params);
      },
      getModel: (
        context: IContextV1,
        params
      ) => {
        return _models.getModel(this.languageTranslator, context, params);
      }
    };
    return RET_VAL;
  }

}

export {
  AcaWatsonLanguageTranslatorV3,
};
