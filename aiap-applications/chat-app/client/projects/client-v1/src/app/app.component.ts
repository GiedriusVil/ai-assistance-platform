/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { environment } from '../environments/environment';

import {
  EventsServiceV1,
  GAcaPropsServiceV1,
  ClientServiceV1,
  TmpErrorsServiceV1,
  ConfigServiceV1,
  SessionServiceV1,
  StorageServiceV1,
} from "client-services";

import * as ramda from 'ramda';

import { _debugX, _errorX } from "client-utils";

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AppComponent';
  }

  _initialized = false;

  private eventsSubscription: Subscription;

  constructor(
    private ngZone: NgZone,
    private title: Title,
    private router: Router,
    private configService: ConfigServiceV1,
    private storageService: StorageServiceV1,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1,
    private clientService: ClientServiceV1,
    private tmpErrorservice: TmpErrorsServiceV1,
  ) { }

  @HostListener('window:resize', ['$event']) onResize() {
    this.eventsService.eventEmit({ onWidgetResize: true });
  }

  ngOnInit(): void {
    this.registerAcaJqueryPlugin();
    this.subscribeToEvents();

    this.requestHostPageInfo();
    this.requestConfiguration();

  }

  requestConfiguration() {
    const CONFIG_REQS = this.configService.getConfig();
    const EVENT = {
      type: 'onConfigDataRequest',
      data: CONFIG_REQS
    };
    _debugX(AppComponent.getClassName(), 'requestConfiguration', { EVENT });
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage'](EVENT, '*')
    }, 0);
  }

  private registerAcaJqueryPlugin() {
    window['acaJqueryPluginReference'] = {
      component: this,
      ngZone: this.ngZone,
      sendMessage: (message: any) => {
        this.clientService.postMessage(message);
      },
      openNewTab: (params: any) => {
        try {
          const EVENT = {
            type: 'onOpenNewTab',
            url: params?.url,
          };
          _debugX(AppComponent.getClassName(), 'onOpenNewTab', { EVENT });
          setTimeout(() => {
            // SAST_FIX ['postMessage']
            window.parent['postMessage'](EVENT, '*');
          }, 0);
        } catch (error) {
          _errorX(AppComponent.getClassName(), 'openNewTab', { error, params });
        }
      }
    };
  }

  ngAfterViewInit(): void {
    this.handleTitle();
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  handleTitle(): void {
    const parts = environment.production ? [] : ['(Development)'];
    const title = ramda.pathOr(undefined, ['title'], this.configService.get());
    if (title) parts.push(title);

    setTimeout(() => {
      this.title.setTitle(parts.join(' '));
    }, 0);
  }

  private subscribeToEvents(): void {
    window.addEventListener('message', event => {
      if (event?.data?.hostPageInfo) {
        this.handleHostPageInfoEvent(event);
      }
    });
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onClientConnect')) {
        this.handleClientConnectEvent(event);
      }
    });
  }

  private handleHostPageInfoEvent(event: any) {
    _debugX(AppComponent.getClassName(), 'handleClientConnectEvent', { event });
    this.gAcaPropsService?.applyHostPageInfo(event.data.hostPageInfo);
    const LANGUAGE_SELECTED_IN_LANGUAGE_SELECTION_FORM: { name: string, iso2: string } = this.storageService.getUserSelectedLanguage();
    this.gAcaPropsService?.applyUserSelectedLanguage(LANGUAGE_SELECTED_IN_LANGUAGE_SELECTION_FORM);
    this.authorizeSession();
  }

  private authorizeSession() {
    this.sessionService.authorize()
      .pipe(
        catchError((error: any) => this.handleAuthorizationError(error))
      ).subscribe((session: any) => {
        this._initialized = true;
        _debugX(AppComponent.getClassName(), 'authorizeSession', { session });
        this.gAcaPropsService.mergeGAcaProps(session?.gAcaProps);
        const TOKEN = session?.token?.value;
        this.storageService.setUser(session);
        this.storageService.setConversationToken(TOKEN);
        this.storageService.setChatCookie({ conversationToken: TOKEN });
        this.eventsService.sessionEmit(session);
        const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
        this.configService.setLanguage(G_ACA_PROPS?.userSelectedLanguage?.iso2 || G_ACA_PROPS?.isoLang);
        const CONNECT_EVENT = {
          onClientConnect: true,
          gAcaProps: G_ACA_PROPS
        };
        this.eventsService.eventEmit(CONNECT_EVENT);

      });
  }

  private handleAuthorizationError(error: any) {
    _debugX(AppComponent.getClassName(), 'handleAuthorizationError', { error });

    // TO_BE_ADDED
    this.tmpErrorservice.setAuthorizationError(error);

    this.router.navigateByUrl('/authorization-error-view');

    this._initialized = true;
    return of();
  }

  private handleClientConnectEvent(event: any) {
    _debugX(AppComponent.getClassName(), 'handleClientConnectEvent', { event });
    if (event?.gAcaProps) {
      this.clientService.connect();
    }
  }

  private requestHostPageInfo() {
    const DATA_ITEM_REQS = ramda.path(['hostPageInfo', 'dataItemReqs'], this.configService.getConfig());
    const EVENT = {
      type: 'onHostPageInfoRequest',
      dataItemReqs: DATA_ITEM_REQS
    };
    _debugX(AppComponent.getClassName(), 'requestHostPageInfo', { EVENT });
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage'](EVENT, '*');
    }, 0);
  }
}
