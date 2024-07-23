/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `${require('../../package.json').name}-jobs-queue-bullmq`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { Queue, Worker, QueueScheduler } = require('bullmq')

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getRedisClient } = require('@ibm-aiap/aiap-redis-client-provider');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

class AcaJobsQueueBullMq {

  constructor(config, tenant) {
    this.config = config;
    this.tenant = tenant;
    this.tenantId = ramda.path(['id'], tenant);
    this.name = ramda.path(['name'], config);
    this.type = ramda.path(['type'], config);
    this.client = ramda.path(['client'], config);
    this.id = ramda.path(['id'], config);
    this.defaultJobConfig = ramda.path(['defaultJob'], config);

    const REDIS_CLIENT = this.getRedisClientIdAndHash(tenant, this.client);
    const ACA_REDIS_CLIENT = getRedisClient(REDIS_CLIENT.id, REDIS_CLIENT.hash);
    this.queue = new Queue(this.name, {
      connection: this._sanitizeOptions(ACA_REDIS_CLIENT.client.options),
      prefix: this._prefix(),
    });
    this.sheduler = new QueueScheduler(this.name, {
      connection: this._sanitizeOptions(ACA_REDIS_CLIENT.client.options),
      prefix: this._prefix(),
    });
    this.worker = new Worker(this.name, this.executor, {
      connection: this._sanitizeOptions(ACA_REDIS_CLIENT.client.options),
      prefix: this._prefix(),
    });
    this.worker.on('error', err => {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, err);
      appendDataToError(ACA_ERROR, {
        redisClientOptions: this._sanitizeOptions(ACA_REDIS_CLIENT.client.options),
        redisOptions: this._sanitizeOptions(ACA_REDIS_CLIENT.redisOptions),
      });
      logger.error('[WORKER_ERROR]', { ACA_ERROR });
    });
  }

  getRedisClientIdAndHash(tenant, clientName) {
    const RET_VAL = {};
    const REDIS_CLIENTS = ramda.path(['redisClients'], tenant);
    for (let i = 0; i < REDIS_CLIENTS.length; i++) {
      if (
        REDIS_CLIENTS[i].name === clientName
      ) {
        RET_VAL.id = REDIS_CLIENTS[i].id;
        RET_VAL.hash = REDIS_CLIENTS[i].hash;
      }
    }
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, `Missing redis client ${clientName}`);
      logger.error('getRedisClientIdAndHash', { ACA_ERROR });
      throw ACA_ERROR;
    }
    return RET_VAL;
  }

  async initialize() {
    if (this.defaultJobConfig) {
      const DATA = this.config;
      DATA.tenant = this.tenant;
      const OPTIONS = ramda.pathOr({}, ['options'], this.defaultJobConfig);
      await this.queue.add('DEFAULT', DATA, OPTIONS);
    }
  }

  async destroy() {
    this.queue.obliterate();
  }

  async executor(job, token) {
    try {
      const DEFAULT_EXECUTOR = async (context, params) => {
        job.log('LAMBDA_MODULE is absent - skipping execution!');
      }
      const TENANT = ramda.path(['data', 'tenant'], job);
      const TENANT_ID = ramda.path(['id'], TENANT);
      const L_MODULE_ID = ramda.path(['data', 'defaultJob', 'lambdaModule'], job);
      job.log(`[tenantId: ${TENANT_ID}, lambdaModule: ${L_MODULE_ID}]`);
      const CONTEXT = {
        user: {
          session: {
            tenant: TENANT
          }
        }
      }
      const PARAMS = {
        job, token
      };
      const RET_VAL = await executeEnrichedByLambdaModule(L_MODULE_ID, DEFAULT_EXECUTOR, CONTEXT, PARAMS);
      job.log('DONE');
      job.updateProgress(100);
      logger.info(`${job.id} -> DONE!`);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('executor', { ACA_ERROR });
      job.log(`ERROR -> ${JSON.stringify(ACA_ERROR)}`);
    }
  }

  _sanitizeOptions(options) {
    const OPTIONS = lodash.cloneDeep(options);
    const RET_VAL = {
      host: OPTIONS?.host,
      port: OPTIONS?.port,
      path: OPTIONS?.path,
      username: OPTIONS?.username,
      password: OPTIONS?.password,
      retry_strategy: OPTIONS?.retry_strategy,
      tls: OPTIONS?.tls,
    }
    return RET_VAL;
  }

  _prefix() {
    return `${this.tenantId}:${this.name}`
  }

  getQueue() {
    return this.queue;
  }

}

module.exports = {
  AcaJobsQueueBullMq,
}
