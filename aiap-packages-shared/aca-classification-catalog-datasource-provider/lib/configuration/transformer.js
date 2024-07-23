/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');

const datasource = (flatClient) => {

    const DATASOURCE_NAME = ramda.path(['name'], flatClient);
    const DATASOURCE_TYPE = ramda.path(['type'], flatClient);
    const DATASOURCE_CLIENT = ramda.path(['client'], flatClient)

    const COLLECTION_CATALOGS = ramda.path(['collectionCatalogs'], flatClient);
    const COLLECTION_CATALOG_RELEASES = ramda.path(['collectionCatalogReleases'], flatClient);

    const COLLECTION_SEGMENTS = ramda.path(['collectionSegments'], flatClient);
    const COLLECTION_FAMILIES = ramda.path(['collectionFamilies'], flatClient);
    const COLLECTION_CLASSES = ramda.path(['collectionClasses'], flatClient);
    const COLLECTION_SUB_CLASSES = ramda.path(['collectionSubClasses'], flatClient);
    const COLLECTION_VECTORS = ramda.path(['collectionVectors'], flatClient);
    const COLLECTION_ACTIONS = ramda.path(['collectionActions'], flatClient);

    const RET_VAL = {
        name: DATASOURCE_NAME,
        type: DATASOURCE_TYPE, 
        client: DATASOURCE_CLIENT,
        collections: {
            catalogs: COLLECTION_CATALOGS, 
            catalogReleases: COLLECTION_CATALOG_RELEASES,
            segments: COLLECTION_SEGMENTS, 
            families: COLLECTION_FAMILIES, 
            classes: COLLECTION_CLASSES, 
            subClasses: COLLECTION_SUB_CLASSES, 
            vectors: COLLECTION_VECTORS,
            actions: COLLECTION_ACTIONS,
        }
    }
    return RET_VAL;
}

const datasources = (flatSources) => {
    const RET_VAL = [];
    if (!ramda.isNil(flatSources)) {
        for(let flatSource of flatSources){
            if (!ramda.isNil(flatSource)) {
                RET_VAL.push(datasource(flatSource));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const CLIENTS_FLAT = provider.getKeys(
        'CLASSIFICATION_CATALOG_DATASOURCE_PROVIDER', 
        [
            'NAME', 
            'TYPE', 
            'CLIENT',
            'COLLECTION_CATALOGS',
            'COLLECTION_CATALOG_RELEASES', 
            'COLLECTION_SEGMENTS',
            'COLLECTION_SEGMENT_RELEASES',
            'COLLECTION_FAMILIES',
            'COLLECTION_FAMILY_RELEASES',
            'COLLECTION_CLASSES',
            'COLLECTION_CLASS_RELEASES',
            'COLLECTION_SUB_CLASSES',
            'COLLECTION_SUB_CLASS_RELEASES',
            'COLLECTION_VECTORS',
            'COLLECTION_ACTIONS',
        ]
    );
    const DATASOURCES = datasources(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('CLASSIFICATION_CATALOG_DATASOURCE_PROVIDER_ENABLED', false, {
        sources: DATASOURCES
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
