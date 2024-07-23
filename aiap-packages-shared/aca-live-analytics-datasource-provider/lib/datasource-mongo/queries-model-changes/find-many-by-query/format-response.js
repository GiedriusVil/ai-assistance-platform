/*
	© Copyright IBM Corporation 2022. All Rights Reserved

	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const formatResponse = (models) => {
    const RET_VAL = [];
    if (!lodash.isEmpty(models) && lodash.isArray(models)) {
        for (let model of models) {
            model.id = model._id;

            delete model._id;

            RET_VAL.push(model);
        }
    }
    return RET_VAL;
};

module.exports = {
    formatResponse,
};