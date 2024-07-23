/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findManyByQuery } = require('./find-many-by-query');
const { executeJobById } = require('./execute-job-by-id');
const { exportMany } = require('./export-many');
const { findOneById } = require('./find-one-by-id');
const { findTopicsByJobId } = require('./find-topics-by-job-id');
const { getSummaryByQuery } = require('./get-summary-by-query');
const { getNewJob } = require('./new-job');
const { saveOne } = require('./save-one');


module.exports = {
  deleteManyByIds,
  executeJobById,
  findManyByQuery,
  exportMany,
  findOneById,
  findTopicsByJobId,
  getSummaryByQuery,
  getNewJob,
  saveOne,
}
