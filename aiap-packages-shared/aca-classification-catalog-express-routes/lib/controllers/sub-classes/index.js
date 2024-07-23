/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { deleteOne } = require('./delete-one');
const { findLiteOneById } = require('./find-lite-one-by-id');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');
const { searchSubClassesByMatch } = require('./search-sub-classes-by-match');

module.exports = {
    deleteOne,
    findLiteOneById,
    findManyByQuery,
    findOneById,
    saveOne,
    searchSubClassesByMatch,
};
