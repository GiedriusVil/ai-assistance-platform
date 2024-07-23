/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { addReview } = require('./add-review');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { deleteOneByConversationId } = require('./delete-one-by-conversation-id');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { removeReview } = require('./remove-review');
const { saveTags } = require('./save-tags');
const { removeTags } = require('./remove-tags');
const { channels } = require('./channels');

module.exports = {
  addReview,
  deleteManyByIds,
  findManyByQuery,
  deleteOneByConversationId,
  findOneById,
  removeReview,
  saveTags,
  removeTags,
  channels,
}
