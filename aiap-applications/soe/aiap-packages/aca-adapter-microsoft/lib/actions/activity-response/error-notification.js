/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const { StatusCodes } = require('botbuilder');

const errorNotification = async () => {
    const RESPONSE_BODY = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        type: 'application/vnd.microsoft.error',
        value: {},
      };
      const RET_VAL = {
        status: StatusCodes.OK,
        body: RESPONSE_BODY
      };
    return RET_VAL;
}

module.exports = {
    errorNotification,
};
