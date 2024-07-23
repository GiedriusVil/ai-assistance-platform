/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeGAcaPropsV1,
} from '../g-aca-props';

import {
  ISoeRawMessageV1,
} from './raw-message';

export interface ISoeRawV1 {
  gAcaProps?: ISoeGAcaPropsV1,
  message?: ISoeRawMessageV1,
  [key: string | number | symbol]: any,
}
