/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceAITranslationServicesCollectionsV1,
} from '../collections';

export interface IDatasourceConfigurationAITranslationServicesV1
  extends IDatasourceConfigurationV1 {
  collections: IDatasourceAITranslationServicesCollectionsV1,
  encryptionKey: string,
}
