/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX, _errorX } from 'client-shared-utils';

import { SessionServiceV1, SideNavServiceV1,} from 'client-shared-services';

@Component({
  selector: 'aca-wbc-main-view',
  templateUrl: './main-view.html',
  styleUrls: ['./main-view.scss']
})
export class MainView implements OnInit {

  static getClassName() {
    return 'MainView';
  }

  @ViewChild('sideNav') sideNav: HTMLElement;

  _views = [];
  views = lodash.cloneDeep(this._views);

  isExpanded = false;
  lambdaExpand: boolean;
  enableWaTests: boolean;

  constructor(
    private router: Router,
    private sideNavService: SideNavServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit() {
    let session: any;
    let sessionApplicationConfigurationViews: any;
    try {
      this.initSideNav();

      session = this.sessionService.getSession();
      _debugX(MainView.getClassName(), 'ngOnInit', { session });
      sessionApplicationConfigurationViews = session?.application?.configuration?.views;
      if (
        !lodash.isEmpty(sessionApplicationConfigurationViews) &&
        lodash.isArray(sessionApplicationConfigurationViews)
      ) {
        const NEW_VIEWS = lodash.cloneDeep(this._views);
        NEW_VIEWS.push(...sessionApplicationConfigurationViews);
        this.views = NEW_VIEWS;
      }
    } catch (error) {
      _errorX(MainView.getClassName(), 'ngOnInit', { error, session });
      throw error;
    }
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

  setExpansion() {
    const EXPANDED = ramda.path(['expanded'], this.sideNav);
    this.sideNavService.setExpansion(EXPANDED);
  }

  handleShowViewClickEvent(view: any): void {
    try {
      _debugX(MainView.getClassName(), 'handleShowViewClickEvent', { view });
      const VIEW_PATH = view?.path;
      this.router.navigateByUrl(VIEW_PATH);
    } catch (error) {
      _errorX(MainView.getClassName(), 'handleShowViewClickEvent', { error, view });
      throw error;
    }
  }

  isSingleViewEnabled(view: any) {
    let retVal = false;
    if (
      !lodash.isEmpty(view?.component) &&
      this.sessionService.isViewAllowed(view?.component) &&
      view?.addToMenu
    ) {
      retVal = true;
    }
    return retVal;
  }

  isMultiViewEnabled(view: any) {
    let retVal = false;
    if (
      !lodash.isEmpty(view?.views) &&
      lodash.isArray(view?.views)
    ) {
      for (let childView of view.views) {
        if (
          this.isSingleViewEnabled(childView)
        ) {
          retVal = true;
          break;
        }
      }
    }
    return retVal;
  }
}
