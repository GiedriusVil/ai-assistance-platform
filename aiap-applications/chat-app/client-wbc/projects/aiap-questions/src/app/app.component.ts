/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { EventBusServiceV1 } from 'client-services';
import { EVENT_TYPE } from 'client-utils';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-questions',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  static getElementTag() {
    return 'aiap-questions';
  }

  title = 'aiap-questions';

  constructor(
    private eventBusService: EventBusServiceV1,
  ) { }

  items = [
    {
      text: "Item 1",
      content: "Question 1"
    },
    {
      text: "Item 2",
      content: "Question 2"
    },
    {
      text: "Item 3",
      content: "Question 3"
    }
  ]

  onDropdownItemClick(item: any) {
    const DATA = lodash.cloneDeep(item);
    this.eventBusService.emit?.({
      type: EVENT_TYPE.SEND_MESSAGE,
      data: DATA,
    });
  }
}
