/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core'

import {
  EventsServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aca-unauthrorized-view',
  templateUrl: './unauthorized-view.html',
  styleUrls: ['./unauthorized-view.scss'],
})
export class UnauthorizedView implements OnInit {

  static getClassName() {
    return 'UnauthorizedView';
  }

  constructor(
    private eventsService: EventsServiceV1,
  ) { }

  ngOnInit() {
    this.eventsService.loadingEmit(false);
  }

  static route() {
    const RET_VAL = {
      path: 'unauthorized',
      component: UnauthorizedView,
      data: {
        title: 'Unauthorized View',
        componentInRoleTable: UnauthorizedView.getClassName(),
        actions: []
      }
    };
    return RET_VAL
  }
}
