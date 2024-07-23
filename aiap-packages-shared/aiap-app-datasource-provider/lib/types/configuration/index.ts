/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceAppCollectionsV1,
} from '../collections';

export interface IDatasourceConfigurationV1App
  extends IDatasourceConfigurationV1 {
  collections: IDatasourceAppCollectionsV1,
  encryptionKey: any,
  users: {
    [key: string]: {
      username: any,
      password: any,
      accessGroupId: any,
    }
  },
}
