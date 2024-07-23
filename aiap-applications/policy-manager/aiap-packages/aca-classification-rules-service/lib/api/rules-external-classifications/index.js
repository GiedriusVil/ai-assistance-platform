/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const { 
    findManyClassesByQuery,
    findManyCommoditiesByQuery,
    findManyFamiliesByQuery,
    findManySegmentsByQuery,
} = require('./find-external-classifications-by-query');

module.exports = {
    findManyClassesByQuery,
    findManyCommoditiesByQuery,
    findManyFamiliesByQuery,
    findManySegmentsByQuery,
}
