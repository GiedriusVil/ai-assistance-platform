/*
   © Copyright IBM Corporation 2024. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-client-metadata-ware-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { ClientMetadataToContextWare } from './lib';

export {
  ClientMetadataToContextWare,
}
