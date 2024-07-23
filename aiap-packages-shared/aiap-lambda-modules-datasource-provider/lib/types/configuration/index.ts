/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceLambdaModulesCollectionsV1,
} from '../collections';

export interface IDatasourceConfigurationLambdaModulesV1
  extends IDatasourceConfigurationV1 {
  collections: IDatasourceLambdaModulesCollectionsV1,
  encryptionKey: string,
};
