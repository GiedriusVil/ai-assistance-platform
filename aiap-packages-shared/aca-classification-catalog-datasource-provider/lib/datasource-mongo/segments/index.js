/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { findManyByQuery } = require('./find-many-by-query');

//
const { deleteManyByCatalogId } = require('./delete-many-by-catalog-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findLiteOneById } = require('./find-lite-one-by-id');
const { findOneById } = require('./find-one-by-id');
const { saveMany } = require('./save-many');
const { saveOne } = require('./save-one');

module.exports = {
   findManyByQuery,

   //
   deleteManyByCatalogId,
   deleteManyByIds,
   findLiteOneById,
   findOneById,
   saveMany,
   saveOne,
}
