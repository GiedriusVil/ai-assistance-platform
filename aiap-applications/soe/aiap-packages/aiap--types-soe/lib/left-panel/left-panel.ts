/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeLeftPanelComponentV1,
} from './left-panel-component';

export interface ISoeLeftPanelV1 {
  clear: any,
  components: ISoeLeftPanelComponentV1[],
  leftPanelStatus: string,
}
