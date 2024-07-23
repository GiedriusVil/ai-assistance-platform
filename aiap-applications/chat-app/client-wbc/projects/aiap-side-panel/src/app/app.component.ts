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
import { EVENT_TYPE, IEvent } from 'client-utils';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-side-panel',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  static getElementTag() {
    return 'aiap-side-panel';
  }

  title = 'aiap-side-panel';

  @Input() params: any;

  constructor(
    private eventBusService: EventBusServiceV1,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

  }


  handleButtonClick(button: any) {
    this.eventBusService.emit?.({
      type: button.action,
      data: button.data
    })
  }
 
}
