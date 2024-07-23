/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const dataItemRequest = (flatRequest) => {
    const RET_VAL = {
        sourceKey: flatRequest?.sourceKey,
        targetKey: flatRequest?.targetKey,
        type: flatRequest?.type, 
    }
    return RET_VAL;    
}

const dataItemRequests = (flatRequests) => {
    const RET_VAL = [];
    if (
        !lodash.isEmpty(flatRequests) && 
        lodash.isArray(flatRequests)
    ) {
        for(let flatRequest of flatRequests){
            if (!lodash.isEmpty(flatRequest)) {
                RET_VAL.push(dataItemRequest(flatRequest));
            }
        }
    }
    return RET_VAL;
}


const transformRawConfiguration = (rawConfiguration, provider) => {
    const FLAT_REQUESTS = provider.getKeys(
        'HOST_PAGE_INFO_DATA_ITEM_REQ', 
        [
            'SOURCE_KEY', 
            'TARGET_KEY',
            'TYPE',
        ]
    );
    const RET_VAL = provider.isEnabled('HOST_PAGE_INFO_ENABLED', false, {
        dataItemReqs: dataItemRequests(FLAT_REQUESTS)
    });
    return RET_VAL;
}

export {
    transformRawConfiguration
}
