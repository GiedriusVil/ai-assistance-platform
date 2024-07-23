/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild } from "@angular/core";

import * as ramda from 'ramda';

import { _debugX } from 'client-shared-utils';

import {
  LocalStorageServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  GenericModalV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-home-view-v1',
  templateUrl: './home-view-v1.html',
  styleUrls: ['./home-view-v1.scss']
})
export class HomeViewV1 implements OnInit {

  static getClassName() {
    return 'HomeViewV1';
  }


  title = this.translateService.instant('home_view_v1.modal.title');
  description = this.translateService.instant('home_view_v1.modal.description');

  @ViewChild('disclaimerModal') disclaimerModal: GenericModalV1;

  constructor(
    private localStorageService: LocalStorageServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit() {
    this.openDisclaimerModal();
  }

  openDisclaimerModal() {
    const APP_SETTINGS = this.localStorageService.get('appSettings');
    const IS_SHOW_DISCLAIMER = APP_SETTINGS?.showDisclaimer;

    if (
      IS_SHOW_DISCLAIMER ||
      IS_SHOW_DISCLAIMER === undefined
    ) {
      setTimeout(() => {
        this.showDisclaimerModal();
      }, 0);
    }
  }

  showDisclaimerModal() {
    _debugX(HomeViewV1.getClassName(), 'showDisclaimerModal',
      {});

    this.disclaimerModal.show();
  }

  static route() {
    return {
      path: '',
      component: HomeViewV1,
      data: {
        name: "Home",
        component: HomeViewV1.getClassName(),
        actions: []
      }
    };
  }

}
