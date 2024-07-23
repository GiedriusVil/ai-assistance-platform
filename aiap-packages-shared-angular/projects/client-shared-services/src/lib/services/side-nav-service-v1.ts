/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import * as ramda from 'ramda';

import { LocalStorageServiceV1 } from './local-storage-service-v1';

@Injectable()
export class SideNavServiceV1 {

  static getClassName() {
    return 'SideNavServiceV1';
  }

  public sideNavExpanded: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private localStorageService: LocalStorageServiceV1,
  ) {
    this.updateExpansion();
  }

  addEventListener() {
    window.addEventListener('toggleSideNav', this.handleToggleSideNavEvent);
  }

  removeEventListener() {
    window.removeEventListener('toggleSideNav', this.handleToggleSideNavEvent);
  }

  handleToggleSideNavEvent = () => {
    this.updateExpansion();
  }

  dispatchToggleSideNavEvent() {
    window.dispatchEvent(new Event('toggleSideNav'));
  }

  getIsExpanded() {
    const APP_SETTINGS = this.localStorageService.get('appSettings');
    const IS_EXPANDED = ramda.path(['isExpandedSideNavigation'], APP_SETTINGS);
    return IS_EXPANDED;
  }

  setExpansion(expanded: boolean) {
    this.localStorageService.set('appSettings', { isExpandedSideNavigation: expanded });
    this.dispatchToggleSideNavEvent();
  }

  updateExpansion() {
    const IS_EXPANDED = this.getIsExpanded();
    if (
      IS_EXPANDED
    ) {
      this.sideNavExpanded.next(true);
    } else {
      this.sideNavExpanded.next(false);
    }
  }

  toggleExpansion() {
    const IS_EXPANDED = this.getIsExpanded();
    if (
      !IS_EXPANDED
    ) {
      this.setExpansion(true);
    } else {
      this.setExpansion(false);
    }
  }

}
