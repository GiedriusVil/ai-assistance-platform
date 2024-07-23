/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BasketServiceV1,
  EventsServiceV1,
  ConfigServiceV1,
  SessionServiceV1,
  StorageServiceV1,
} from "client-services";

import {
  _debugX,
} from "client-utils";

@Component({
  selector: 'aca-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss']
})
export class HeaderActionsComponent implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'HeaderActionsComponent';
  }

  private eventsSubscription: Subscription;

  surveyEnabled = false;
  config = {};

  _state = {
    basketItemsQty: 0,
    basketSubscription: undefined,
    enabledHeaderActions: {
      chat: false,
      basket: false,
      survey: false,
      profile: false,
      identification: false
    }
  }

  tabs: any[] = [
    {
      name: 'chat',
      active: false
    },
    {
      name: 'buyingRequest',
      active: false
    },
    {
      name: 'survey',
      active: false
    },
    {
      name: 'profile',
      active: false
    },
  ]

  constructor(
    private storageService: StorageServiceV1,
    private configService: ConfigServiceV1,
    private eventsService: EventsServiceV1,
    private basketService: BasketServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit(): void {
    this.initData();
    this.setPrevData();
    this._state.basketSubscription = this.basketService.subscribe(BasketServiceV1.EVENT.CHANGED, (event: any) => {
      const STATE = lodash.cloneDeep(this._state);
      STATE.basketItemsQty = this.basketService.getBasketItemsQty();
      this._state = STATE;
      _debugX(HeaderActionsComponent.getClassName(), 'event', {
        this_state: this._state,
        new_state: STATE
      });
    });
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onTransferToChannel')) {
        this.resetHeaderActions();
      }
    });
  }

  ngAfterViewInit(): void {
    this.resetHeaderActions();
  }

  ngOnDestroy(): void {
    this.basketService.destroy(this._state.basketSubscription);
    this.eventsSubscription.unsubscribe();
  }

  showFilledCart(): boolean {
    let retVal = false;
    if (this._state.basketItemsQty > 0) {
      retVal = true;
    }
    return retVal;
  }

  resetHeaderActions(): void {
    const STATE = lodash.cloneDeep(this._state);
    const HEADER_ACTIONS = lodash.keys(STATE?.enabledHeaderActions);
    HEADER_ACTIONS.forEach((action) => {
      const IS_HEADER_ACTION_ENABLED = this.isHeaderActionEnabled(action);
      STATE.enabledHeaderActions[action] = IS_HEADER_ACTION_ENABLED;
      this._state = STATE;
      _debugX(HeaderActionsComponent.getClassName(), 'enableHeaderAction', {
        name: action,
        enabled: IS_HEADER_ACTION_ENABLED
      });
      this.eventsService.eventEmit({ onHeaderActionsShow: IS_HEADER_ACTION_ENABLED });
    });
  }

  isHeaderActionEnabled(name: string): boolean {
    let retVal = false;
    const SESSION = this.sessionService.getSession();
    const IS_FEATURE_ENABLED = ramda.path(['engagement', 'chatApp', 'headerActions', name], SESSION);
    if (lodash.isBoolean(IS_FEATURE_ENABLED)) {
      retVal = IS_FEATURE_ENABLED;
    } else {
      retVal = this.isHeaderActionEnabledByConditions(name);
    }
    return retVal;
  }

  isHeaderActionEnabledByConditions(name: string): boolean {
    let retVal = false;
    const SESSION = this.sessionService.getSession();
    const HEADER_ACTION_SHOW_CONDITIONS = ramda.path(['engagement', 'chatApp', 'headerActions', name, 'conditions'], SESSION);

    if (!lodash.isEmpty(HEADER_ACTION_SHOW_CONDITIONS)) {
      for (let condition of HEADER_ACTION_SHOW_CONDITIONS) {
        const ENGAGEMENT_CONDITION_PATH = ramda.pathOr([], ['path'], condition);
        const ENGAGEMENT_CONDITION_VALUES = ramda.pathOr([], ['values'], condition);
        if (lodash.isArray(ENGAGEMENT_CONDITION_PATH)) {
          let currentConditionValue = ramda.path(ENGAGEMENT_CONDITION_PATH, SESSION);
          if (lodash.isUndefined(currentConditionValue)) {
            currentConditionValue = 'undefined';
          }
          if (lodash.includes(ENGAGEMENT_CONDITION_VALUES, currentConditionValue)) {
            retVal = true;
          } else {
            retVal = false;
            return retVal;
          }
        }
      }
    }

    return retVal;
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = this._state.enabledHeaderActions[name];
    return RET_VAL;
  }

  private initData() {
    this.config = this.configService.get();
  }

  showSurvey() {
    this.eventsService.eventEmit({ onSurveyShow: true });
  }

  isActive(name: string): boolean {
    let retVal = false;
    this.tabs.forEach(tab => {
      if (tab.name === name && tab.active === true) {
        retVal = true;
      }
    });
    return retVal;
  }

  onClick(name: string) {
    this.tabs.forEach(tab => {
      if (tab.name === name) {
        if (tab.active === false) {
          tab.active = true;
        } else {
          tab.active = true;
        }
      } else {
        tab.active = false;
      }
    })
  }

  private setPrevData() {
    this.surveyEnabled = this.storageService.isSurveySubmitted() && this.config['surveyEnabled'];
  }

  isGenesysChannel(channelId: string): boolean {
    const RET_VAL = lodash.startsWith(channelId, 'genesys');
    return RET_VAL;
  }

  requestIdentification(): void {
    const SESSION = this.retrieveCurrentSession();
    const IDENTIFICATION_CONFIGS = SESSION?.engagement?.chatApp?.headerActions?.identification;

    const REDIRECT_HOST = IDENTIFICATION_CONFIGS?.redirectHost;
    const REDIRECT_PATH = IDENTIFICATION_CONFIGS?.redirectPath;
    const TARGET_HOST = IDENTIFICATION_CONFIGS?.targetHost;
    const TARGET_PATH = IDENTIFICATION_CONFIGS?.targetPath;
    const OPTIONS = IDENTIFICATION_CONFIGS?.options;

    let conversationId = undefined;
    const CHANNEL = SESSION?.channel?.id;
    if (this.isGenesysChannel(CHANNEL)) {
      conversationId = SESSION?.channel?.convId?.conversationIdExternal;
    }

    const EVENT = {
      type: 'onIdentificationRequest',
      redirectHost: REDIRECT_HOST,
      redirectPath: REDIRECT_PATH,
      targetHost: TARGET_HOST,
      targetPath: TARGET_PATH,
      conversationId: conversationId,
      options: OPTIONS,
    };
    _debugX(HeaderActionsComponent.getClassName(), 'onIdentificationRequest', { EVENT: EVENT });
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage'](EVENT, '*');
    }, 0);
  }

  retrieveCurrentSession(): any {
    const RET_VAL = this.sessionService.getSession();
    return RET_VAL;
  }
}
