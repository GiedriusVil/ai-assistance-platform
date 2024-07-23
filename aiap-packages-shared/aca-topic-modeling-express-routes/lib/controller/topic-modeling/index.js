/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { newTopicModelingJob } = require('./new-job');
const { deleteOneById } = require('./delete-one-by-id');
const { executeJobById } = require('./execute-job-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { exportMany } = require('./export-many');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { findTopicsByJobId } = require('./find-topics-by-job-id');
const { getSummaryByQuery } = require('./get-summary-by-query');
const { saveOne } = require('./save-one');

module.exports = {
  newTopicModelingJob,
  deleteOneById,
  executeJobById,
  deleteManyByIds,
  exportMany,
  findManyByQuery,
  findOneById,
  findTopicsByJobId,
  getSummaryByQuery,
  saveOne,
};
