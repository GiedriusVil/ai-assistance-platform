/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { v4 as uuidv4 } from 'uuid';

export const ACA_ERROR_TYPE = {
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INITIALIZATION_ERROR: 'INITIALIZATION_ERROR',
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
    UNDEFINED_ERROR: 'UNDEFINED_ERROR',
    QUERY_ERROR: 'QUERY_ERROR',
    CONNECTION_ERROR: 'CONNECTION_ERROR'
}

export class AcaError {
    id: string | undefined;
    type: string | undefined;
    message: string | undefined;
    moduleId: string | undefined;
    data: any | undefined;
}

export function ensureId(error: AcaError) {
    if (
        lodash.isObject(error) &&
        lodash.isEmpty(error?.id)
    ) {
        error.id = uuidv4();
    }
}

const ensureModuleId = (moduleId: string, error: AcaError) => {
    if (
        lodash.isObject(error) &&
        lodash.isEmpty(error?.moduleId)
    ) {
        error.moduleId = moduleId;
    }
}

export function createAcaError(moduleId: string, type: string, message: string, data: any) {
    const RET_VAL: any = {
        type: type,
        message: `${message}`,
    };
    if (
        !lodash.isEmpty(data)
    ) {
        RET_VAL.data = data;
    }
    ensureId(RET_VAL);
    ensureModuleId(moduleId, RET_VAL);
    return RET_VAL;
}

export function throwAcaError(moduleId: string, type: string, message: string, data?: any) {
    const ERROR = createAcaError(moduleId, type, message, data);
    throw ERROR;
}