/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app--types-chat-server-v1';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


abstract class ChatServerV1 {

  async initialize() {
    //
  }

}

export {
  ChatServerV1,
}
