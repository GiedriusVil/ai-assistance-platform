/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceEngagementCollectionsV1,
} from '../collections';

export interface IDatasourceConfigurationEngagementsV1
  extends IDatasourceConfigurationV1 {
  collections: IDatasourceEngagementCollectionsV1,
}
