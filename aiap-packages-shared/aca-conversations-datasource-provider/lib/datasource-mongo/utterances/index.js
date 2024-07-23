/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findManyByConversationsIds } = require('./find-many-by-conversation-ids');
const { findManyByQuery } = require('./find-many-by-query');
const { findTopIntentsByQuery } = require('./find-top-intents-by-query');
const { retrieveTotals } = require('./retrieve-totals');
const { deleteManyByQuery } = require('./delete-many-by-query');
const { findLatest5ByQuery } = require('./find-lastest-5-by-query');
const { findManyByAiChangeRequestIds } = require('./find-many-by-ai-change-request-ids');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');
const { saveMany } = require('./save-many');
const { updateOneById } = require('./update-one-by-id');
const { updateManyByParams } = require('./update-many-by-params');
const { findManyByQueryV2 } = require('./find-many-by-query-v2');
const { maskMany } = require('./mask-many');



module.exports = {
  findManyByConversationsIds,
  findManyByQuery,
  findTopIntentsByQuery,
  retrieveTotals,
  deleteManyByQuery,
  findLatest5ByQuery,
  findManyByAiChangeRequestIds,
  findOneById,
  saveOne,
  saveMany,
  updateOneById,
  updateManyByParams,
  findManyByQueryV2,
  maskMany,
};
