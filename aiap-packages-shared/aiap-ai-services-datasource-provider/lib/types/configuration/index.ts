/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceAiServicesCollectionsV1,
} from '../collections';

export interface IDatasourceConfigurationAiServicesV1
  extends IDatasourceConfigurationV1 {
  collections: IDatasourceAiServicesCollectionsV1,
  encryptionKey: string,
}
