/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';

import * as ramda from 'ramda';

import {
  SideNavServiceV1,
  StateServiceV1,
  ConfigServiceV1
} from 'client-shared-services';


@Component({
  selector: 'aiap-main-view-native-body-v1',
  templateUrl: './main-view-native-body-v1.html',
  styleUrls: ['./main-view-native-body-v1.scss']
})
export class MainViewNativeBodyV1 implements OnInit, OnDestroy {

  @ViewChild('sideNav') sideNav: HTMLElement;

  @Input() session;

  isExpanded = false;
  lambdaExpand: boolean;
  enableWaTests: boolean;

  constructor(
    private configService: ConfigServiceV1,
    private stateService: StateServiceV1,
    private sideNavService: SideNavServiceV1,
  ) { }

  ngOnInit() {
    this.initSideNav();
    this.enableWaTests = this.configService.getConfig().enableWaTests;
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
