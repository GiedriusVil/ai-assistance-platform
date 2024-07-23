/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import * as lodash from 'lodash';

import { CHAT_APP_BUTTON_EVENT, _debugX, _errorX } from 'client-utils';

import { ChatAppButtonService } from '../../services';
import { ConsentForm } from '../consent-form/consent.form';

@Component({
  selector: 'aiap-language-selection-form',
  templateUrl: './language-selection.form.html',
  styleUrls: ['./language-selection.form.scss']
})
export class LanguageSelectionForm implements OnInit {

  static getClassName() {
    return 'LanguageSelectionForm';
  }

  _state = {
    expanded: false,
    selectedLanguage: null
  };
  state = lodash.cloneDeep(this._state);

  @Output() onLanguageSelectionEvent = new EventEmitter<any>();

  text: any = {};

  constructor(
    private chatAppButtonService: ChatAppButtonService,
  ) { }

  ngOnInit() {
    this.getLanguageSelectionConfiguration();
  }

  getLanguageSelectionConfiguration () {
    const OPTIONS = this.chatAppButtonService.getWbcChatAppButtonOptions();
    const LANGUAGE = OPTIONS?.lang;
    this.text = OPTIONS?.chatAppButton?.text?.[LANGUAGE]?.languageSelection;
  }

  onSubmit() {
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.ON_LANGUAGE_SELECTION_SUBMIT,
      data: this.state.selectedLanguage,
    };
    _debugX(LanguageSelectionForm.getClassName(), 'onSubmit', {
      this_state: this.state,
      event: EVENT
    });
    this.onLanguageSelectionEvent.emit(EVENT);
  }

  onCancel() {
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.ON_LANGUAGE_SELECTION_CANCEL,
    };
    _debugX(LanguageSelectionForm.getClassName(), 'onCancel', {
      this_state: this.state,
      event: EVENT
    });
    this.onLanguageSelectionEvent.emit(EVENT);
  }

  onLanguageSelected(index: number) {
    for (let i = 0; i < this.text?.languages.length; i++) {
      (this.text.languages[i] as { name: string, iso2: string, selected?: boolean}).selected = false;
      if (i === index) {
        (this.text.languages[i] as { name: string, iso2: string, selected?: boolean}).selected = true;
        this.state.selectedLanguage = this.text.languages[i];
      }
    }
  }

  handleExpandLanguageSelectionForm(consentForm: ConsentForm) {
    if (consentForm?.state?.expanded) {
      consentForm.handleExpandConsentForm();
      return;
    }

    const CHAT_APP_BUTTON_WRAPPER_EL = document.getElementById('chat-app-button-wrapper');
    const CHAT_APP_BUTTON_EL = document.getElementById('chat-app-button');
    const CHAT_APP_EXPAND_ICON_EL = document.getElementById('chat-app-button-icon-expand');
    const LANGUAGEL_SELECTION_FIELD_EL = document.getElementById('chat-app-language-selection-form');

    if (!this.state.expanded) {
      CHAT_APP_BUTTON_WRAPPER_EL.classList.add('chat-button-wrapper--expanded');
      CHAT_APP_BUTTON_EL.classList.add('chat-button--expanded');
      CHAT_APP_EXPAND_ICON_EL.classList.add('chat-icon-expand--expanded');
      LANGUAGEL_SELECTION_FIELD_EL.classList.add('language-selection-form--expanded');
    } else {
      CHAT_APP_BUTTON_WRAPPER_EL.classList.remove('chat-button-wrapper--expanded');
      CHAT_APP_BUTTON_EL.classList.remove('chat-button--expanded');
      CHAT_APP_EXPAND_ICON_EL.classList.remove('chat-icon-expand--expanded');
      LANGUAGEL_SELECTION_FIELD_EL.classList.remove('language-selection-form--expanded');
    }
    this.state.expanded = !this.state.expanded;
  }
}

export interface LanguageSelection {
  name: string,
  iso2: string,
  timestamp?: number,
}
