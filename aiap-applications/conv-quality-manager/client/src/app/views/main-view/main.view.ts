/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  Flash16,
  Script16,
  Certificate16,
  Renew20,
} from '@carbon/icons';

import {
  IconService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  LocalStorageServiceV1,
  SideNavServiceV1,
  StateServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aca-wbc-main-view',
  templateUrl: './main.view.html',
  styleUrls: ['./main.view.scss']
})
export class MainView implements OnInit, OnDestroy {

  static getClassName() {
    return 'MainView';
  }

  @ViewChild('sideNav') sideNav: HTMLElement;

  @Input() session;


  _views: any = [];
  views = lodash.cloneDeep(this._views);


  isExpanded = false;
  lambdaExpand: boolean;
  enableWaTests: boolean;
  subscription: Subscription;

  constructor(
    private router: Router,
    private stateService: StateServiceV1,
    private sideNavService: SideNavServiceV1,
    private iconService: IconService,
    private localStorageService: LocalStorageServiceV1,
    private sessionService: SessionServiceV1,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    let session: any;
    let sessionApplicationConfigurationViews: any;
    try {
      this.initSideNav();

      this.iconService.register(Flash16);
      this.iconService.register(Script16);
      this.iconService.register(Certificate16);
      this.iconService.register(Renew20);

      this.subscription = this.activatedRoute.url.subscribe(() => this.setViewPathToStorage());

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
    this.subscription.unsubscribe();
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
      for (const CHILD_VIEW of view.views) {
        if (
          this.isSingleViewEnabled(CHILD_VIEW)
        ) {
          retVal = true;
          break;
        }
      }
    }
    return retVal;
  }

  private setViewPathToStorage() {
    const SESSION = this.sessionService.getSession();
    const APPLICATION_ID = SESSION?.application?.id;
    const PATH_NAME = window.location.pathname;

    if (
      !lodash.isEmpty(APPLICATION_ID) &&
      PATH_NAME !== '/main-view-wbc/conv-quality-manager'
    ) {
      const LAST_OPEN_VIEW = {
        [APPLICATION_ID]: {
          lastOpenViewPath: PATH_NAME
        }
      };
      this.localStorageService.set('acaAiAssistantsPlatform', LAST_OPEN_VIEW);
      _debugX(MainView.getClassName(), 'setViewPathToStorage', LAST_OPEN_VIEW);
    }
  }
}
