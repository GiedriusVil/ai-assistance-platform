/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const DEFAULT_COLLECTIONS = {
    catalogs: 'catalogs',
    segments: 'segments',
    families: 'families',
    classes: 'classes',
    subClasses: 'subClasses',
    actions: 'actions',
    vectors: 'vectors',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

    const CATALOGS = ramda.path(['catalogs'], COLLECTIONS_CONFIGURATION);
    const SEGMENTS = ramda.path(['segments'], COLLECTIONS_CONFIGURATION);
    const FAMILIES = ramda.path(['families'], COLLECTIONS_CONFIGURATION);
    const CLASSES = ramda.path(['classes'], COLLECTIONS_CONFIGURATION);
    const SUB_CLASSES = ramda.path(['subClasses'], COLLECTIONS_CONFIGURATION);
    const ACTIONS = ramda.path(['actions'], COLLECTIONS_CONFIGURATION);
    const VECTORS = ramda.path(['vectors'], COLLECTIONS_CONFIGURATION);

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(CATALOGS)
    ) {
        RET_VAL.catalogs = CATALOGS;
    }
    if (
        !lodash.isEmpty(SEGMENTS)
    ) {
        RET_VAL.segments = SEGMENTS;
    }
    if (
        !lodash.isEmpty(FAMILIES)
    ) {
        RET_VAL.families = FAMILIES;
    }
    if (
        !lodash.isEmpty(CLASSES)
    ) {
        RET_VAL.classes = CLASSES;
    }
    if (
        !lodash.isEmpty(SUB_CLASSES)
    ) {
        RET_VAL.subClasses = SUB_CLASSES;
    }
    if (
        !lodash.isEmpty(ACTIONS)
    ) {
        RET_VAL.actions = ACTIONS;
    }
    if (
        !lodash.isEmpty(VECTORS)
    ) {
        RET_VAL.vectors = VECTORS;
    }
    return RET_VAL;
}

module.exports = {
    sanitizedCollectionsFromConfiguration,
}
