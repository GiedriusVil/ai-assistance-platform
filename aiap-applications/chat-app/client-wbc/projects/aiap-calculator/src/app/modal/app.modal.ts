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
  selector: 'aiap-calculator-modal',
  templateUrl: './app.modal.html',
  styleUrls: ['./app.modal.scss'],
})
export class AppModal {
  static getElementTag() {
    return 'aiap-calculator-modal';
  }

  title = 'aiap-calculator-modal';

  icons: any = {};

  constructor(
    private eventBusService: EventBusServiceV1,
  ) { }


  onCloseModal() {
    this.eventBusService.emit?.({
      type: EVENT_TYPE.CLOSE_MODAL,
    })
  }

  onSendMessage() {
    this.eventBusService.emit?.({
      type: EVENT_TYPE.SEND_MESSAGE,
      data: {
        text: "hello",
      }
    })
  }
}
