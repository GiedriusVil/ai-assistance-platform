/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';

import {
  StateServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-main-view-wbc-body-v1',
  templateUrl: './main-view-wbc-body-v1.html',
  styleUrls: ['./main-view-wbc-body-v1.scss']
})
export class MainViewWbcBodyV1 implements OnInit {

  static getClassName() {
    return 'MainViewWbcBodyV1';
  }

  constructor(
    private stateService: StateServiceV1,
  ) { }

  ngOnInit() {
    //
  }

  onActivate(event: any) {
    window.scroll(0, 0);
  }

  onDeactivate(event: any) {
    if (
      event?.componentName
    ) {
      this.stateService.setSavedState(event.componentName, {
        scrollTop: (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
      });
    }
  }
}
