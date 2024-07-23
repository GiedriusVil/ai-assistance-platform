/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash';

@Pipe({
  name: 'AnswerStoreId',
})
export class AnswerStoreIdPipe implements PipeTransform {
  transform(selectedAnswerStore: any): any {
    let name: String;
   const SELECTED_ANSWER_STORE_ID = selectedAnswerStore?.id;
   const SELECTED_ANSWR_STORE_PULL_CONFIG = selectedAnswerStore?.pullConfiguration;
   if(
     lodash.isObject(SELECTED_ANSWR_STORE_PULL_CONFIG) &&
     lodash.isEmpty(SELECTED_ANSWR_STORE_PULL_CONFIG)
     ){
    name = `${selectedAnswerStore?.id} (Missing Pull Source)`
   } else {
    name = selectedAnswerStore?.id;
   }
   return name;
  }
}
