/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as lodash from 'lodash';

import {
  EventsServiceV1,
  GAcaPropsServiceV1,
  ClientServiceV2,
  LeftPanelServiceV1,
  DataServiceV2,
  SessionServiceV2,
} from "client-services";

import { _debugX } from "client-utils";
@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
})
export class SuggestionsComponent implements OnInit {

  static getClassName() {
    return 'SuggestionsComponent';
  }

  form: UntypedFormGroup;
  requestError: Boolean = false;
  inputText: String;
  suggestions: any[] = [];
  _isInputDisabled = false;
  _isSessionEnded = false;
  suggestionsEnabled;

  private eventsSubscription: Subscription;

  constructor(
    private eventsService: EventsServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1,
    private sessionService: SessionServiceV2,
    private dataService: DataServiceV2,
    private clientService: ClientServiceV2,
    public leftPanelService: LeftPanelServiceV1,
  ) { }

  ngOnInit() {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onInputSuggestions')) this.retrieveInputTextSuggestions(event['onInputSuggestions']);
    });
  }

  isSuggestionsAvailable() {
    let retVal = false;
    const IS_DEFAULT_BOT_CHANNEL_ACTIVE = this.clientService.isDefaultBotChannelActive();
    if (
      this.inputText.length > 0 &&
      IS_DEFAULT_BOT_CHANNEL_ACTIVE
    ) {
      retVal = true;
    }
    return retVal;
  }

  isSuggestionsEnabled() {
    let retVal = true;
    if (!this.suggestionsEnabled || lodash.isEmpty(this.suggestions)) {
      retVal = false;
    }
    return retVal;
  }

  retrieveInputTextSuggestions(text) {
    this.inputText = text;
    const SESSION = this.sessionService.getSession();
    const ENGAGEMENT_SUGGESTIONS = SESSION?.engagement?.chatApp?.suggestions;
    this.suggestionsEnabled = ENGAGEMENT_SUGGESTIONS?.enabled || false;
    const SUGGESTIONS_COUNT = ENGAGEMENT_SUGGESTIONS?.suggestionsCount || 4;
    const MIN_CHAR_COUNT = ENGAGEMENT_SUGGESTIONS?.minCharCount || 4;
    const CLASSIFIER_MODEL_ID = SESSION?.engagement?.soe?.classifier?.model?.id;
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    const PARAMS = {
      classifierModelId: CLASSIFIER_MODEL_ID,
      gAcaProps: G_ACA_PROPS,
      inputText: text,
      suggestionsCount: SUGGESTIONS_COUNT
    };
    if (!this.suggestionsEnabled || text.length < MIN_CHAR_COUNT || this.requestError) {
      this.suggestions = [];
    } else {
      this.dataService.retrieveInputTextSuggestions(PARAMS).subscribe((result: any) => {
        const ERRORS = result?.errors;
        if (!lodash.isEmpty(ERRORS)) {
          this.suggestions = [];
          this.requestError = true;
          _debugX(SuggestionsComponent.getClassName(), 'retrieveInputTextSuggestionsErrors', { ERRORS });
        } else {
          this.suggestions = result;
        }
      });
    }
  }

  postMessage(message) {
    const TEXT = message?.text;
    const MESSAGE = {
      type: 'user',
      text: TEXT,
      timestamp: new Date().getTime()
    };
    this.clientService.postMessage(MESSAGE);
    this.eventsService.eventEmit({ onSuggestionMessage: {} });
    this.suggestions = [];

  }
}
