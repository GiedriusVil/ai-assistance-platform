
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Injectable, OnDestroy } from "@angular/core";

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  SessionServiceV2,
  StorageServiceV2,
  ChatWidgetServiceV1,
  EventsServiceV1,
} from '.';

import { Subscription } from "rxjs";

@Injectable()
export class LeftPanelServiceV1 implements OnDestroy {

  private chatWidgetSubscription: Subscription;
  private leftPanelSubscription: Subscription;

  chatWindowInitialized = false;

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private sessionService: SessionServiceV2,
    private storageService: StorageServiceV2,
    private eventsService: EventsServiceV1,
  ) {
    this.subscribeToEvents();
  }

  ngOnDestroy(): void {
    this.chatWidgetSubscription.unsubscribe();
    this.leftPanelSubscription.unsubscribe();
  }

  isLeftPanelVisible() {
    const RET_VAL = !lodash.isEmpty(this.sessionService.getSession()) &&
      this.leftPanelEnabled() &&
      this.chatWidgetService.getWidgetOptions().leftPanelOpened &&
      this.chatWindowInitialized;
    return RET_VAL;
  }

  leftPanelEnabled() {
    const RET_VAL = ramda.pathOr(false, ['engagement', 'chatApp', 'leftPanel', 'options', 'enabled'], this.sessionService.getSession());
    return RET_VAL;
  }

  leftPanelWidth() {
    const DEFAULT_WIDTH = this.chatWidgetService.getWidgetOptions().leftPanelWidth;
    const RET_VAL = parseInt(ramda.pathOr(DEFAULT_WIDTH, ['engagement', 'chatApp', 'leftPanel', 'options', 'width'], this.sessionService.getSession()));

    return RET_VAL;
  }

  isButtonVisible() {
    const RET_VAL = this.leftPanelEnabled() && !this.isLeftPanelVisible();
    return RET_VAL;
  }

  getDefaultLayout() {
    const RET_VAL = this.sessionService.getSession()?.engagement?.chatApp?.leftPanel?.layout || [];
    return RET_VAL;
  }

  resetLeftPanelState() {
    const DEFAULT_LEFT_PANEL_LAYOUT = this.getDefaultLayout();
    this.storageService.saveLeftPanel(DEFAULT_LEFT_PANEL_LAYOUT);
    this.eventsService.leftPanelEmit({ leftPanelStateChange: true });
  }

  addNewComponents(leftPanelChanges) {
    let componentLayout = this.storageService.getLeftPanel();

    if (leftPanelChanges.clear) {
      componentLayout = [];
    }

    const LAYOUT = {};
    componentLayout.forEach((element, index) => {
      LAYOUT[index + 1] = {
        existing: element,
        new: [],
      }
    })

    leftPanelChanges?.components?.forEach(element => {
      if (!LAYOUT[element.position]) {
        LAYOUT[element.position] = { new: [] };
      }
      LAYOUT[element.position].new.push(element);
    });

    const NEW_COMPONENT_ARRAY = [];
    Object.keys(LAYOUT).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
      if (LAYOUT[key].new) {
        NEW_COMPONENT_ARRAY.push(...LAYOUT[key].new)
      }
      if (LAYOUT[key].existing) {
        NEW_COMPONENT_ARRAY.push(LAYOUT[key].existing)
      }
    })

    const LEFT_PANEL_STATE = leftPanelChanges?.leftPanelState;
    if (!lodash.isEmpty(LEFT_PANEL_STATE)) {
      this.chatWidgetService.broadcast(LEFT_PANEL_STATE, true);
    }
    this.storageService.saveLeftPanel(NEW_COMPONENT_ARRAY);
    this.eventsService.leftPanelEmit({ leftPanelStateChange: true });
  }


  private subscribeToEvents() {
    this.chatWidgetSubscription = this.chatWidgetService.subscribe((event: any) => {
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_INITIALIZED) {
        this.chatWindowInitialized = true;
      }
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE) {
        this.chatWindowInitialized = false;
      }
    });

    this.leftPanelSubscription = this.eventsService.leftPanelEmitter.subscribe(event => {
      if (event?.addNewComponent) {
        this.addNewComponents(event.leftPanel);
      }
    });
  }
}
