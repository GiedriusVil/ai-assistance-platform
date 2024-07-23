/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { Buffer } from 'buffer';

import { _errorX } from './logger.utils';

const MODULE_ID = 'DecodeUtils';

const _isBase64 = (value:any) => {
    const RET_VAL = Buffer.from(value, 'base64').toString('base64') === value;
    return RET_VAL;
}

export function decodeAttributeWithBase64(object: any, attribute: string) {
    try {
        if (!lodash.isObject(object)) {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR', 
                message: `Provided input parameter object is not a object!`
            };
            throw ACA_ERROR;
        }
        let value = ramda.path([attribute], object);
        if (
            !lodash.isEmpty(value) &&
            lodash.isString(value) && 
            _isBase64(value)
        ) {
            object[attribute] = Buffer.from(value, 'base64').toString('utf-8');
        }
    } catch(error) {
        _errorX(MODULE_ID, 'decodeAttributeWithBase64', {error});
    }
}