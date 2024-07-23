/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { CHAT_APP_BUTTON_EVENT, _debugX, _errorX } from 'client-utils';

import { ChatAppButtonService } from '../../services';
import { LocalStorageServiceV1 } from 'client-services';

@Component({
  selector: 'aca-consent-form',
  templateUrl: './consent.form.html',
  styleUrls: ['./consent.form.scss']
})
export class ConsentForm implements OnInit {

  static getClassName() {
    return 'ConsentForm';
  }

  @Output() onConsentEvent = new EventEmitter<any>();

  _state = {
    expanded: false,
  };
  state = lodash.cloneDeep(this._state);

  text: any = {};

  constructor(
    private chatAppButtonService: ChatAppButtonService,
    private localStorageService: LocalStorageServiceV1,
  ) { }

  ngOnInit() {
    this.setTextByLanguage();
  }

  setTextByLanguage() {
    const OPTIONS = this.chatAppButtonService.getWbcChatAppButtonOptions();
    const LANGUAGE = this.getSelectedLanguageCode() || OPTIONS?.lang;
    this.text = OPTIONS?.chatAppButton?.text?.[LANGUAGE];
  }

  getSelectedLanguageCode() {
    const LANGUAGE_SELECTED = this.localStorageService.getItem('aiap-chat-app-language-selection');
    const SELECTED_LANGUAGE_CODE = LANGUAGE_SELECTED?.iso2;
    return SELECTED_LANGUAGE_CODE;
  }

  handleExpandConsentForm() {
    const CHAT_APP_BUTTON_WRAPPER_EL = document.getElementById('chat-app-button-wrapper');
    const CHAT_APP_BUTTON_EL = document.getElementById('chat-app-button');
    const CHAT_APP_EXPAND_ICON_EL = document.getElementById('chat-app-button-icon-expand');
    const CONSENT_FIELD_EL = document.getElementById('chat-app-consent-form');

    this.setTextByLanguage();
    if (!this.state.expanded) {
      CHAT_APP_BUTTON_WRAPPER_EL.classList.add('chat-button-wrapper--expanded');
      CHAT_APP_BUTTON_EL.classList.add('chat-button--expanded');
      CHAT_APP_EXPAND_ICON_EL.classList.add('chat-icon-expand--expanded');
      CONSENT_FIELD_EL.classList.add('consent-form--expanded');
    } else {
      CHAT_APP_BUTTON_WRAPPER_EL.classList.remove('chat-button-wrapper--expanded');
      CHAT_APP_BUTTON_EL.classList.remove('chat-button--expanded');
      CHAT_APP_EXPAND_ICON_EL.classList.remove('chat-icon-expand--expanded');
      CONSENT_FIELD_EL.classList.remove('consent-form--expanded');
    }
    this.state.expanded = !this.state.expanded;
  }

  onAgree() {
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.ON_CONSENT_AGREE,
    };
    _debugX(ConsentForm.getClassName(), 'onAgree', {
      this_state: this.state,
      event: EVENT
    });
    this.onConsentEvent.emit(EVENT);
  }

  onDiscard() {
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.ON_CONSENT_DISCARD,
    };
    _debugX(ConsentForm.getClassName(), 'onDiscard', {
      this_state: this.state,
      event: EVENT
    });
    this.onConsentEvent.emit(EVENT);
  }

}
