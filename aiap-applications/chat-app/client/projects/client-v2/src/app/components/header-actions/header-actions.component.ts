/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BasketServiceV1,
  ChatWidgetServiceV1,
  EventsServiceV1,
  ConfigServiceV2,
  SessionServiceV2,
  StorageServiceV2,
} from "client-services";

import {
  _debugX,
} from "client-utils";


@Component({
  selector: 'aca-chat-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss']
})
export class HeaderActionsComponent implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderActionsComponent';
  }

  surveyEnabled = false;
  config = {};

  _state = {
    basketItemsQty: 0,
    basketSubscription: undefined,
  }

  tabs: any[] = [
    {
      name: 'app-main-view',
      active: true
    },
    {
      name: 'aca-basket-view',
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
    private storageService: StorageServiceV2,
    private configService: ConfigServiceV2,
    private eventsService: EventsServiceV1,
    private basketService: BasketServiceV1,
    private sessionService: SessionServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
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
  }

  ngOnDestroy(): void {
    this.basketService.destroy(this._state.basketSubscription);
  }

  showFilledCart(): boolean {
    let retVal = false;
    if (this._state.basketItemsQty > 0) {
      retVal = true;
    }
    return retVal;
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = ramda.pathOr(true, ['engagement', 'chatApp', 'headerActions', name], this.sessionService.getSession());
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
        tab.active = true;
        this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_VIEW_CHANGE, name);
      } else {
        tab.active = false;
      }
    })
  }

  private setPrevData() {
    this.surveyEnabled = this.storageService.isSurveySubmitted() && this.config['surveyEnabled'];
  }
}
