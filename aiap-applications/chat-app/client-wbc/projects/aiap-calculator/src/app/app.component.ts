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
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { EventBusServiceV1 } from 'client-services';
import { EVENT_TYPE } from 'client-utils';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-calculator',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  static getElementTag() {
    return 'aiap-calculator';
  }

  @ViewChild('modal', {read: TemplateRef}) modalTemplate: TemplateRef<any> | undefined;

  title = 'aiap-calculator';

  icons: any = {};

  constructor(
    private eventBusService: EventBusServiceV1,
  ) { }

  onEqualClick() {
    this.eventBusService.emit?.({
      type: EVENT_TYPE.OPEN_MODAL,
      data: {
        template: this.modalTemplate
      }
    })
    console.log("Atidarom modala", this.modalTemplate)
  }
}
