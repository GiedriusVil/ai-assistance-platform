/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-datasource-provider-configuration';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  SCHEMA
} from './schema';

import {
  transformRawConfiguration
} from './transformer';

class AcaHostPageInfoConfigurator {

    static NAME = 'hostPageInfo';

    static async transformRawConfiguration(rawConfiguration, provider) {
        const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
        return RET_VAL;
    }

    static attachToJoiSchema(schema) {
        return schema.append(AcaHostPageInfoConfigurator.schema());
    }

    static schema() {
        const RET_VAL = {
            [AcaHostPageInfoConfigurator.NAME]: SCHEMA,
        };
        return RET_VAL;
    }

    static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
        if (lodash.isEmpty(RET_VAL)) {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR',
                message: `[${MODULE_ID}] Missing required transformer schema!`
            };
            throw ACA_ERROR;
        }
        RET_VAL[AcaHostPageInfoConfigurator.NAME] = await AcaHostPageInfoConfigurator.transformRawConfiguration(rawConfiguration, provider);
    }
}

export {
    AcaHostPageInfoConfigurator,
}
