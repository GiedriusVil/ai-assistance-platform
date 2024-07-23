/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-datasource-provider-datasource-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const REGISTRY = {};

const addOneToRegistryById = (id, datasource) => {
    try {
        if (
            lodash.isEmpty(id)
        ) {
            const MESSAGE = 'Missing id required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
        }
        if (
            lodash.isEmpty(datasource)
        ) {
            const MESSAGE = 'Missing datasource required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { datasource });
        }
        REGISTRY[id] = datasource;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const addOneToRegistryByIdAndHash = (datasource) => {
    try {
        if (
            lodash.isEmpty(datasource)
        ) {
            const MESSAGE = 'Missing datasource required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { datasource });
        }
        const ID = ramda.path(['id'], datasource);
        const HASH = ramda.path(['hash'], datasource);
        if (
            lodash.isEmpty(ID)
        ) {
            const MESSAGE = 'Missing required datasource.id parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { datasource });
        }
        if (
            lodash.isEmpty(HASH)
        ) {
            const MESSAGE = 'Missing required datasource.hash parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { datasource });
        }
        addOneToRegistryById(`${ID}:${HASH}`, datasource);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const addOneToRegistryByName = (datasource) => {
    try {
        if (
            lodash.isEmpty(datasource)
        ) {
            const MESSAGE = 'Missing datasource required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { datasource });
        }
        const NAME = ramda.path(['name'], datasource);
        if (
            lodash.isEmpty(NAME)
        ) {
            const MESSAGE = 'Missing datasource.name required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { datasource });
        }
        addOneToRegistryById(NAME, datasource);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const addManyToRegistryByIdAndHash = (datasources) => {
    try {
        if (
            !lodash.isArray(datasources)
        ) {
            const MESSAGE = 'Wrong parameter($datasources) type! [Expected Array]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        for (let datasource of datasources) {
            addOneToRegistryByIdAndHash(datasource);
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const addManyToRegistryByName = (datasources) => {
    try {
        if (
            !lodash.isArray(datasources)
        ) {
            const MESSAGE = 'Wrong parameter($datasources) type! [Expected Array]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        for (let datasource of datasources) {
            addOneToRegistryByName(datasource);
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const getOneById = (id) => {
    try {
        if (
            lodash.isEmpty(id)
        ) {
            const MESSAGE = 'Missing id required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
        }
        const RET_VAL = REGISTRY[id];
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const getOneByIdAndHash = (id, hash) => {
    try {
        if (
            lodash.isEmpty(id)
        ) {
            const MESSAGE = 'Missing id required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
        }
        if (
            lodash.isEmpty(hash)
        ) {
            const MESSAGE = 'Missing hash required parameter! [EMPTY, NULL, UNDEFINED]';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { hash });
        }
        const RET_VAL = getOneById(`${id}:${hash}`);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const getRegistry = () => {
    return REGISTRY;
}

module.exports = {
    addOneToRegistryById,
    addOneToRegistryByIdAndHash,
    addOneToRegistryByName,
    addManyToRegistryByIdAndHash,
    addManyToRegistryByName,
    getOneById,
    getOneByIdAndHash,
    getRegistry,
}
