/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findLiteManyByLevel } = require('./find-lite-many-by-level');
const { findLiteOneById } = require('./find-lite-one-by-id');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { retrieveCanonicalFormByInput } = require('./retrieve-canonical-form-by-input');
const { saveOne } = require('./save-one');

module.exports = {
   deleteManyByIds,
   findLiteManyByLevel,
   findLiteOneById,
   findManyByQuery,
   findOneById,
   retrieveCanonicalFormByInput,
   saveOne,
}
