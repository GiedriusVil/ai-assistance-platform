/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { StatusCodes } = require('botbuilder');

const replaceCard = async (card) => {
  const RESPONSE_BODY = {
    statusCode: StatusCodes.OK,
    type: 'application/vnd.microsoft.card.adaptive',
    value: card,
  };
  const RET_VAL = {
    status: StatusCodes.OK,
    body: RESPONSE_BODY
  };
  return RET_VAL;
}

module.exports = {
  replaceCard,
};
