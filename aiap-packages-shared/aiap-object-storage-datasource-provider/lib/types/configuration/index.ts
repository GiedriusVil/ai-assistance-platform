/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceObjectStorageCollectionsV1,
} from '../collections';

export interface IDatasourceConfigurationObjectStorageV1
  extends IDatasourceConfigurationV1 {
  collections: IDatasourceObjectStorageCollectionsV1,
}
