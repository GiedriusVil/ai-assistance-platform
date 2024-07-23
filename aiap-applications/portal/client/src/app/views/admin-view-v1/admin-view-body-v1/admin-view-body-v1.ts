/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';

import * as ramda from 'ramda';

import {
  StateServiceV1,
  SideNavServiceV1,
} from 'client-shared-services';

import {
  AdministratorServiceV1,
} from '../../../services';

@Component({
  selector: 'aiap-admin-view-body-v1',
  templateUrl: './admin-view-body-v1.html',
  styleUrls: ['./admin-view-body-v1.scss']
})
export class AdminViewBodyV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AdminViewBodyV1';
  }

  @ViewChild('sideNav') sideNav: HTMLElement;

  @Input() session;

  isExpanded = false;
  views: Array<any> = [];

  constructor(
    private stateService: StateServiceV1,
    private sideNavService: SideNavServiceV1,
    private administratorService: AdministratorServiceV1,
  ) { }

  ngOnInit() {
    this.initSideNav();

    this.views = this.administratorService.getViews();
  }

  ngOnDestroy(): void {
    this.sideNavService.removeEventListener();
  }

  initSideNav() {
    this.sideNavService.sideNavExpanded.subscribe(value => {
      this.isExpanded = value;
    });
    this.sideNavService.updateExpansion();
    this.sideNavService.addEventListener();
  }

  onActivate(event: any) {
    window.scroll(0, 0);
  }

  onDeactivate(event: any) {
    if (event.componentName) {
      this.stateService.setSavedState(event.componentName, {
        scrollTop: (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
      });
    }
  }

  setExpansion() {
    const EXPANDED = ramda.path(['expanded'], this.sideNav);
    this.sideNavService.setExpansion(EXPANDED);
  }

}
