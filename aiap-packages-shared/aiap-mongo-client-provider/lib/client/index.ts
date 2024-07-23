/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
  Mongo DB events

  1. Server Discovery and Monitoring (SDAM) 
  Link: https://www.mongodb.com/docs/drivers/node/current/fundamentals/monitoring/cluster-monitoring/

  2. ConnectionPoolMonitoringEvent
  Link: https://mongodb.github.io/node-mongodb-native/4.9/modules.html

  3. Command Monitoring
  Link: https://www.mongodb.com/docs/drivers/node/current/fundamentals/monitoring/command-monitoring/

  4. Not documented:
  open - based on observations fired after serverOpeningEvent (check 1 group). Used in this example: https://www.mongodb.com/community/forums/t/mongo-isconnected-alternative-for-node-driver-v-4/117041/2
  close
  error
  timeout
*/
const MODULE_ID = 'aiap-mongo-client-provider-mongo-client-v1';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  retryAsync,
} from '@ibm-aiap/aiap-wrapper-async-retry';

import {
  MongoClient,
  MongoClientOptions,
  Db,
  InsertOneResult,
} from 'mongodb';

import {
  constructOptions,
  constructRetryOptions,
} from './options';

import {
  aggregateToArray,
  deleteMany,
  deleteOne,
  distinct,
  findOneAndDelete,
  findOneAndUpdate,
  findOne,
  findToArrayExtended,
  findToArray,
  insertOne,
  updateMany,
  updateOne,
} from './methods';

class AiapMongoClientV1 {

  configuration: any;

  id: string;
  hash: string;
  name: string;

  settings: any;

  db: Db;
  client: MongoClient;

  openStatusPromise: Promise<any>;
  isTopologyClosed: boolean;

  timerConnection: any;

  constructor(configuration) {
    try {
      this.configuration = configuration;
      this.id = this.configuration?.id;
      this.hash = this.configuration?.hash;
      this.name = this.configuration?.name;
      this.settings = this.configuration?.options;

      this.db = undefined;
      this.client = undefined;

      this.openStatusPromise = null;
      this.isTopologyClosed = false;


    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get _options(): MongoClientOptions {
    const RET_VAL = constructOptions(this.configuration);
    return RET_VAL;
  }

  async initialize() {
    let options;
    try {
      options = this._options;

      const URI = this.configuration?.options?.uri;

      this.client = new MongoClient(`${URI}`, options);

      this.addOpenListener(this.client);
      this.addTopologyClosedListener(this.client);

      await this.client.connect();
      this.db = this.client.db();

      logger.info(this.initialize.name,
        {
          this_id: this.id,
          this_name: this.name,
          this_hash: this.hash,
        });

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { options: options, this_configuration: this.configuration });
      logger.error(this.initialize.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  addOpenListener(client: MongoClient) {
    this.openStatusPromise = new Promise((resolve) => {
      const LISTENER = () => {
        clearTimeout(this.timerConnection);
        resolve('open');
      };
      client.once('open', LISTENER);
      this.timerConnection = setTimeout(
        () => {
          client.removeListener('open', LISTENER);
          logger.warn('MongoDB open listener timeout');
          resolve('timeout');
          //TODO: Need to update connection option in aiap DB for tenants. Remove OR after update
        },
        this.settings.onlineEventTimeout || 30000
      );
    });
  }

  addTopologyClosedListener(client: MongoClient) {
    client.once('topologyClosed', () => {
      this.isTopologyClosed = true;
    });
  }

  async status() {
    let status = 'offline';
    try {
      const OPEN_STATUS = await this.openStatusPromise;
      if (
        OPEN_STATUS === 'open' &&
        !this.isTopologyClosed &&
        this.db
      ) {
        status = 'online';
      }
      const RET_VAL = {
        openStatus: OPEN_STATUS,
        isTopologyClosed: this.isTopologyClosed,
        status
      }
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { status });
      logger.error(this.status.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getDB() {
    try {
      const STATUS = await this.status();

      if (
        'online' !== STATUS?.status
      ) {
        logger.warn(this.getDB.name,
          {
            STATUS
          });

        await this.initialize();
      }

      const RET_VAL = this.db;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.getDB.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getClient() {
    try {
      const STATUS = await this.status();
      if (
        'online' !== STATUS?.status
      ) {
        logger.warn(this.getClient.name, { STATUS });
        await this.initialize();
      }
      const RET_VAL = this.client;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.getClient.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  /**
  * @deprecated
  */
  mongoClient(): MongoClient {
    return this.client;
  }

  /**
  * @deprecated
  */
  mongoDB(): Db {
    return this.db;
  }

  async close() {
    if (
      this.client
    ) {
      await this.client.close();
    }
  }

  async __aggregateToArray(context, params) {
    try {

      const RET_VAL = await retryAsync(
        aggregateToArray(this, context, params),
        constructRetryOptions(this, context, params),
      );

      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__aggregateToArray.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __deleteMany(context, params) {
    try {
      const RET_VAL = await retryAsync(
        deleteMany(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__deleteMany.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __deleteOne(context, params) {
    try {
      const RET_VAL = await retryAsync(
        deleteOne(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__deleteOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __distinct(context, params) {
    try {
      const RET_VAL = await retryAsync(
        distinct(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__distinct.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __findOneAndDelete(context, params) {
    try {
      const RET_VAL = await retryAsync(
        findOneAndDelete(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__findOneAndDelete.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __findOneAndUpdate(context, params) {
    try {
      const RET_VAL = await retryAsync(
        findOneAndUpdate(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__findOneAndUpdate.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __findOne(context, params) {
    try {
      const RET_VAL = await retryAsync(
        findOne(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__findOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __findToArray(context, params) {
    try {
      const RET_VAL = await retryAsync(
        findToArray(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__findToArray.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __findToArrayExtended(context, params) {
    try {
      const RET_VAL = await retryAsync(
        findToArrayExtended(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__findToArray.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __insertOne(context, params): Promise<InsertOneResult<Document>> {
    try {
      const RET_VAL = await retryAsync(
        insertOne(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__insertOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __updateMany(context, params) {
    try {
      const RET_VAL = await retryAsync(
        updateMany(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__updateMany.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __updateOne(context, params) {
    try {
      const RET_VAL = await retryAsync(
        updateOne(this, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      const ACA_ERROR_DATA = { this_hash: this.hash, this_name: this.name };
      appendDataToError(ACA_ERROR, { ACA_ERROR_DATA });
      logger.error(this.__updateOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

export {
  AiapMongoClientV1,
}
