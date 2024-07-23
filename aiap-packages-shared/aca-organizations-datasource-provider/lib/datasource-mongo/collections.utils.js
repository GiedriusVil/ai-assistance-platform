/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    organizations: 'organizations',
    organizationsReleases: 'organizations_releases',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

    const ORGANIZATIONS = ramda.path(['organizations'], COLLECTIONS_CONFIGURATION);
    const ORGANIZATIONS_RELEASES = ramda.path(['organizationsReleases'], COLLECTIONS_CONFIGURATION);

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(ORGANIZATIONS)
    ) {
        RET_VAL.organizations = ORGANIZATIONS;
    }
    if (
        !lodash.isEmpty(ORGANIZATIONS_RELEASES)
    ) {
        RET_VAL.organizationsReleases = ORGANIZATIONS_RELEASES;
    }
    return RET_VAL;
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
