/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-worker-provider-woker-botium';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const CronJob = require('cron').CronJob;
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { AcaTestWorker, ACA_TEST_WORKER_STATUS } = require('../worker');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { getAcaTestCasesDatasourceByTenant } = require('@ibm-aca/aca-test-cases-datasource-provider');

const { AcaAgentWorkerBotium } = require('./worker');

const calculateResultStatus = (convos) => {
  let retVal = 'PASSED';
  if (
    lodash.isArray(convos)
  ) {
    for (let convo of convos) {
      let convoStatus = ramda.path(['status'], convo);
      if (
        retVal !== convoStatus
      ) {
        retVal = 'FAILED';
        break;
      }
    }
  }
  return retVal;
}

class AcaTestWorkerBotium extends AcaTestWorker {

  constructor(definition) {
    super(definition);
    try {
      this.worker = new AcaAgentWorkerBotium({ ...this.configuration, slot: this.slot });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      this.status = ACA_TEST_WORKER_STATUS.INVALID;
      this.statusMessage = ACA_ERROR.message;
    }
  }

  async initialize() {
    try {
      await this.worker.Build(
        this.configuration.Capabilities,
        this.configuration.Sources,
        this.configuration.Envs
      );
      this.schedule();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('initialize', { ACA_ERROR });
      this.status = ACA_TEST_WORKER_STATUS.INVALID;
      this.statusMessage = ACA_ERROR.message;
    }
  }

  schedule() {
    const JOB_EXECUTOR = async () => {
      if (
        this.status === ACA_TEST_WORKER_STATUS.BUSY
      ) {
        const SKIP_MESSAGE = `[${this.tenantId}:${this.id}:${this.name}] Worker is busy skipping iteration!`;
        logger.warn(SKIP_MESSAGE);
        return;
      }
      await this.processPendingExecutions();
    }
    this.job = new CronJob(this.cronExpression, JOB_EXECUTOR);
    this.job.start();
  }

  async processPendingExecutions() {
    let appDatasource;
    let tenant;
    let testCasesDatasource;
    let execution;
    let testCase;
    try {
      this.status = ACA_TEST_WORKER_STATUS.BUSY;
      appDatasource = getDatasourceV1App();
      tenant = await appDatasource.tenants.findOneById({}, { id: this.tenantId });
      testCasesDatasource = getAcaTestCasesDatasourceByTenant(tenant);
      const QUERY = {
        worker: {
          id: this.id,
          name: this.name
        },
        statuses: ['PENDING']
      }
      execution = await testCasesDatasource.executions.lockOneByQuery({}, QUERY);
      if (
        !lodash.isEmpty(execution)
      ) {
        delete execution.result;
        testCase = await testCasesDatasource.cases.findOneById({}, execution.testCase);
        logger.info('processPendingExecutions:before', {
          tenantId: this.tenantId,
          worker: {
            id: this.id,
            name: this.name,
            configuration: this.configuration,
          },
          testCase: testCase,
          execution: execution,
        });
        execution.status = 'IN_PROGRESS';
        await testCasesDatasource.executions.saveOne({}, { execution });

        execution.result = await this.runJSONScript(testCase.script);
        execution.status = calculateResultStatus(execution.result);
        execution.executed = new Date();

        logger.info('processPendingExecutions:after', {
          tenantId: this.tenantId,
          worker: {
            id: this.id,
            name: this.name,
            configuration: this.configuration,
          },
          testCase: testCase,
          execution: execution,
        });
      } else {
        logger.info('processPendingExecutions:no_scheduled_executions', {
          tenantId: this.tenantId,
          worker: {
            id: this.id,
            name: this.name,
            configuration: this.configuration,
          },
        });
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      execution.result = ACA_ERROR;
      execution.status = 'ERRORED';
      execution.executed = new Date();
      logger.error('processPendingExecutions:error', {
        tenantId: this.tenantId,
        worker: {
          id: this.id,
          name: this.name,
          configuration: this.configuration,
        },
        testCase: testCase,
        execution: execution,
        ACA_ERROR
      });
    } finally {
      const EXECUTION_ID = ramda.path(['id'], execution);
      if (
        !lodash.isEmpty(EXECUTION_ID)
      ) {
        execution.lock = false;
        await testCasesDatasource.executions.saveOne({}, { execution });
      }
      logger.info('processPendingExecutions:finally', {
        tenantId: this.tenantId,
        worker: {
          id: this.id,
          name: this.name,
          configuration: this.configuration,
        },
        testCase: testCase,
        execution: execution,
      });
      this.status = ACA_TEST_WORKER_STATUS.READY;
    }
  }

  async runJSONScript(script) {
    try {
      this.status = ACA_TEST_WORKER_STATUS.BUSY;
      await this.worker.Start();
      const RET_VAL = await this.worker.RunJSONScript(script);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('runJSONScript', { ACA_ERROR });
      throw ACA_ERROR;
    } finally {
      await this.worker.Stop();
      this.status = ACA_TEST_WORKER_STATUS.READY;
    }
  }

  async reset(definition) {
    try {
      this.status = ACA_TEST_WORKER_STATUS.RESETING;
      delete this.statusMessage;
      if (
        this.job
      ) {
        this.job.stop()
      }
      if (
        this.worker &&
        this.worker.container
      ) {
        await this.worker.Stop();
      }
      if (
        this.worker
      ) {
        await this.worker.Clean();
      }
      this.resetDefinition(definition);
      await this.initialize();
      this.status = ACA_TEST_WORKER_STATUS.READY;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      this.status = ACA_TEST_WORKER_STATUS.INVALID;
      this.statusMessage = ACA_ERROR.message;
      logger.error('destroy', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
  async destroy() {
    try {
      this.job.stop();
      await this.worker.Stop();
      await this.worker.Clean();

      this.status = ACA_TEST_WORKER_STATUS.DESTROYED;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('destroy', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

module.exports = {
  AcaTestWorkerBotium,
}
