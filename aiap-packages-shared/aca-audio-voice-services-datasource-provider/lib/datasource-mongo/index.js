/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaAudioVoiceServicesDatasource } = require('../datasource');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _audioVoiceServices = require('./audio-voice-services');

class AcaAudioVoiceServicesDatasourceMongo extends AcaAudioVoiceServicesDatasource {

  constructor(configuration) {
    super(configuration);
    try {
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;

      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async _getClient() {
    const RET_VAL = await this.acaMongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.acaMongoClient.getDB();
    return RET_VAL;
  }

  async _getAcaMongoClient() {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        const ACA_MONGO_CLIENT_ID = this.configuration?.client;
        const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;
        this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
        retVal = this.acaMongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve AcaMongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getAcaMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() { }

  get audioVoiceServices() {
    return {
      saveOne: async (context, params) => {
        return _audioVoiceServices.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _audioVoiceServices.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _audioVoiceServices.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _audioVoiceServices.deleteManyByIds(this, context, params);
      },
    };
  }

}

module.exports = {
  AcaAudioVoiceServicesDatasourceMongo,
};
