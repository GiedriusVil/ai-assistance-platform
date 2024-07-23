/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `${require('../../package.json').name}-jobs-queue-board-bull-board`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getManyByTenantId } = require('@ibm-aca/aca-jobs-queue-provider');

const { AcaJobsQueueBoard } = require('../board');

class AcaJobsQueueBoardBull extends AcaJobsQueueBoard {

   constructor(config) {
      super(config);

      this.basePath = ramda.path(['basePath'], config);
      this.tenantId = ramda.path(['tenantId'], config);

      this.ensureContainerExistance();

      this.adapter = new ExpressAdapter();
      this.adapter.setBasePath(this.getPath());

      this.board = createBullBoard({
         queues: [],
         serverAdapter: this.adapter
      });

      const QUEUES = getManyByTenantId(this.tenantId);
      for (let queue of QUEUES) {
         this.addQueue(queue);
      }
      logger.info('INITIALIZED');
   }

   ensureContainerExistance() {
      if (
         lodash.isEmpty(this.container)
      ) {
         this.container = { type: 'CONTAINER_QUEUES' };
      }
   }

   addQueue(queue) {
      const QUEUE_ID = ramda.path(['id'], queue);
      try {
         if (
            lodash.isEmpty(QUEUE_ID)
         ) {
            const MESSAGE = `Missing required queue.id parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
         }
         this.ensureContainerExistance();
         this.removeQueue(queue);
         this.container[QUEUE_ID] = queue;
         const ADAPTER = new BullMQAdapter(queue.getQueue());
         this.board.addQueue(ADAPTER);
      } catch (error) {
         const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
         logger.error('addQueue', { ACA_ERROR });
         throw ACA_ERROR;
      }
   }

   removeQueue(queue) {
      try {
         this.ensureContainerExistance();
         const QUEUE_ID = ramda.path(['id'], queue);
         const QUEUE_NAME = ramda.path(['queue', 'name'], queue);
         if (
            !lodash.isEmpty(QUEUE_ID)
         ) {
            delete this.container[QUEUE_ID]; // Shouldn't we do some internal sanitization ?  --> check with bull mq docs!
         }
         if (
            !lodash.isEmpty(QUEUE_NAME)
         ) {
            this.board.removeQueue(QUEUE_NAME);
         }
      } catch (error) {
         const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
         logger.error('removeQueue', { ACA_ERROR });
         throw ACA_ERROR;
      }
   }

   getRouter() {
      return this.adapter.getRouter();
   }

   getPath() {
      return `${this.basePath}/${this.tenantId}`;
   }

}

module.exports = {
   AcaJobsQueueBoardBull,
}
