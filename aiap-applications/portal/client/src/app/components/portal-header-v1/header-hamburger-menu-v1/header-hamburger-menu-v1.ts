/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  _debugX,
} from 'client-shared-utils';

import { SideNavServiceV1 } from 'client-shared-services';

@Component({
  selector: 'aiap-header-hamburger-menu-v1',
  templateUrl: './header-hamburger-menu-v1.html',
  styleUrls: ['./header-hamburger-menu-v1.scss']
})
export class HeaderHamburgerMenuV1 implements OnInit {

  static getClassName() {
    return 'HeaderHamburgerMenu';
  }

  @ViewChild('hamburger') hamburger: HTMLElement;

  constructor(
    private sideNavService: SideNavServiceV1,
  ) { }

  ngOnInit(): void {
    //
  }

  handleHamburgerClickEvent(event: any) {
    _debugX(HeaderHamburgerMenuV1.getClassName(), 'handleHamburgerClickEvent',
      {
        event,
      });
    this.sideNavService.toggleExpansion();
  }

}
