/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  HostListener,
  ViewChild
} from '@angular/core';

import * as lodash from 'lodash';

import {
  LocalStorageServiceV1
} from 'client-services';

import {
  CHAT_APP_BUTTON_EVENT,
  _debugX,
  _errorX
} from 'client-utils';

import {
  ChatAppButtonService,
  ChatAppButtonConsentService,
  WindowEventsServiceV1
} from '../../services';

import {
  ConsentForm
} from '../consent-form/consent.form';

import {
  LanguageSelectionForm,
  LanguageSelection
} from '../language-selection-form/language-selection.form';

@Component({
  selector: 'aca-chat-app-button',
  templateUrl: './chat.app.button.html',
  styleUrls: ['./chat.app.button.scss']
})
export class ChatButton implements OnInit {

  static getClassName() {
    return 'ChatAppButton';
  }

  @HostListener('window:message', ['$event'])
  handleWindowMessageEvent(event) {
    switch (event?.data?.type) {
      case CHAT_APP_BUTTON_EVENT.CHAT_APP_OPEN:
        this.handleChatAppOpenEvent();
        break;
    }
  }
  @ViewChild('languageSelectionForm') languageSelectionForm: LanguageSelectionForm;
  @ViewChild('consentForm') consentForm: ConsentForm;

  _state = {
    isUIConsentFormEnabled: true,
    isLanguageSelectionFormEnabled: false,
  };
  state = lodash.cloneDeep(this._state);

  text: any = {};

  constructor(
    private chatAppButtonService: ChatAppButtonService,
    private chatAppButtonConsentService: ChatAppButtonConsentService,
    private localStorageService: LocalStorageServiceV1,
    private windowEventsService: WindowEventsServiceV1,
  ) { }

  ngOnInit() {
    this.setTextByLanguage();
    this.setIsUILanguageSelectionFormEnabled();
    this.setIsUIConsentFormEnabled();
    //
    this.handleRestoreOrPreload();
  }

  setTextByLanguage() {
    const OPTIONS = this.chatAppButtonService.getWbcChatAppButtonOptions();
    const LANGUAGE = this.getLanguageSelection()?.iso2 || OPTIONS?.lang;
    this.text = OPTIONS?.chatAppButton?.text?.[LANGUAGE];
  }

  handleRestoreOrPreload() {
    if (
      this.isChatAppOpened() &&
      this.isLoadChatAppAllowed()
    ) {
      this.restoreChatApp();
    } else if (
      !this.isConsentConfigurationPresent() ||
      this.isLoadChatAppAllowed()
    ) {
      this.preloadChatAppScripts();
    }
  }

  handleChatAppOpenEvent() {
    if (
      this.isLoadChatAppAllowed()
    ) {
      this.loadChatApp();
    } else if (
      this.state?.isLanguageSelectionFormEnabled
    ) {
      this.languageSelectionForm.handleExpandLanguageSelectionForm(this.consentForm);
    } else if (
      this.state?.isUIConsentFormEnabled
    ) {
      this.consentForm.handleExpandConsentForm();
    } else {
      this.confirmConsentAndLoadChatApp();
    }
  }

  restoreChatApp() {
    this.hideChatButton();
    this.loadChatApp();
  }

  preloadChatAppScripts() {
    this.chatAppButtonService.appendChatAppScripts();
  }

  confirmConsentAndLoadChatApp() {
    const ENGAGEMENT_CHAT_APP_BUTTON = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton;
    this.chatAppButtonConsentService.confirmUserConsent(ENGAGEMENT_CHAT_APP_BUTTON);
    this.chatAppButtonService.setWbcChatAppButtonOptions();
    this.loadChatApp();
  }

  handleConsentEvent(event) {
    switch (event?.type) {
      case CHAT_APP_BUTTON_EVENT.ON_CONSENT_AGREE:
        this.onConsentAgree();
      case CHAT_APP_BUTTON_EVENT.ON_CONSENT_DISCARD:
        this.onConsentDiscard();
    }
  }

  onConsentAgree() {
    this.consentForm.handleExpandConsentForm();
    this.confirmConsentAndLoadChatApp();
  }

  onConsentDiscard() {
    this.consentForm.handleExpandConsentForm();
  }

  isLoadChatAppAllowed() {
    const ENGAGEMENT_CHAT_APP_BUTTON = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton;
    const RET_VAL =
      (
        !this.state?.isLanguageSelectionFormEnabled
        || (this.isLanguageSelectionPresent() && this.isLanguageSelectionValidForMilliseconds())
      )
      && (
        this.isUserConsentPresent()
        || !this.chatAppButtonConsentService.consentFunctionsExist(ENGAGEMENT_CHAT_APP_BUTTON)
      );
    return RET_VAL;
  }

  setIsUIConsentFormEnabled() {
    const CONSENT_CONFIGS = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton?.consent;
    this.state.isUIConsentFormEnabled = CONSENT_CONFIGS?.isUIFormEnabled ?? true;
  }

  isUserConsentPresent() {
    const ENGAGEMENT_CHAT_APP_BUTTON = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton;
    const RET_VAL = this.chatAppButtonConsentService.retrieveUserConsent(ENGAGEMENT_CHAT_APP_BUTTON);
    return RET_VAL;
  }

  isConsentConfigurationPresent() {
    const CONSENT_CONFIGS = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton?.consent;
    const RET_VAL = !lodash.isEmpty(CONSENT_CONFIGS);
    return RET_VAL;
  }

  isChatAppOpened() {
    const CHAT_APP_V1_STATE_OPENED =
      this.localStorageService.getChatAppV1StateParameter('maximized') ||
      this.localStorageService.getChatAppV1StateParameter('minimized');
    const CHAT_APP_V2_STATE_OPENED = this.localStorageService.getChatAppStateParameter('opened');
    const CHAT_APP_V3_STATE_OPENED = this.localStorageService.getChatAppV3StateParameter('opened');
    const RET_VAL = CHAT_APP_V1_STATE_OPENED || CHAT_APP_V2_STATE_OPENED || CHAT_APP_V3_STATE_OPENED;
    return RET_VAL;
  }

  loadChatApp() {
    this.localStorageService.setWbcChatAppButtonStateParameter('chatOpened', true);
    const FAST_HIDE_ON_CLICK = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton?.fastHideOnClick ?? true;
    if (FAST_HIDE_ON_CLICK) {
      this.hideChatButton();
    }
    if (
      !lodash.isElement(document.getElementById('get-widget-options')) ||
      !lodash.isElement(document.getElementById('get-widget')) ||
      !lodash.isElement(document.getElementById('get-widget-default'))
    ) {
      this.chatAppButtonService.appendChatAppScripts();
    } else {
      this.windowEventsService.broadcastChatAppClientOpenEvent();
    }
  }

  hideChatButton() {
    this.localStorageService.setWbcChatAppButtonStateParameter('show', false);
  }

  setIsUILanguageSelectionFormEnabled() {
    const LANGUAGE_SELECTION_CONFIGS = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton?.languageSelection;
    this.state.isLanguageSelectionFormEnabled = LANGUAGE_SELECTION_CONFIGS?.isUIFormEnabled ?? false;
  }

  handleLanguageSelectionEvent(event) {
    switch (event?.type) {
      case CHAT_APP_BUTTON_EVENT.ON_LANGUAGE_SELECTION_SUBMIT:
        this.onLanguageSelectionSubmit(event?.data);
      case CHAT_APP_BUTTON_EVENT.ON_LANGUAGE_SELECTION_CANCEL:
        this.onLanguageSelectionCancel();
    }
  }

  onLanguageSelectionSubmit(languageSelected) {
    this.setLanguageSelection(languageSelected);
    if (
      this.state?.isUIConsentFormEnabled &&
      !this.isUserConsentPresent()
    ) {
      setTimeout(() => {
        this.consentForm.handleExpandConsentForm();
      }, 0);
    } else {
      this.loadChatApp();
    }
  }

  onLanguageSelectionCancel() {
    this.languageSelectionForm.handleExpandLanguageSelectionForm(this.consentForm);
  }

  isLanguageSelectionPresent() {
    const LANGUAGE_SELECTED = this.getLanguageSelection();
    if (
      this.validateLanguageSelected(LANGUAGE_SELECTED)
    ) {
      return true;
    }
    return false;
  }

  getLanguageSelection() {
    const LANGUAGE_SELECTED = this.getLanguageSelectionFromLocalStorage();
    return LANGUAGE_SELECTED;
  }

  getLanguageSelectionFromLocalStorage() {
    const LANGUAGE_SELECTED = this.localStorageService.getItem('aiap-chat-app-language-selection');
    return LANGUAGE_SELECTED;
  }

  setLanguageSelection(languageSelection: LanguageSelection) {
    const RET_VAL = this.setLanguageSelectionToLocalStorage(languageSelection);
    return RET_VAL;
  }

  setLanguageSelectionToLocalStorage(languageSelection: LanguageSelection) {
    languageSelection.timestamp = (new Date()).getTime();
    this.localStorageService.setItem('aiap-chat-app-language-selection', languageSelection);
  }

  isLanguageSelectionValidForMilliseconds() {
    const LANGUAGE_SELECTED = this.getLanguageSelectionFromLocalStorage();
    if (
      !this.validateLanguageSelected(LANGUAGE_SELECTED)
    ) {
      return false;
    }

    const LANGUAGE_SELECTION_CONFIGS = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatAppButton?.languageSelection;
    const VALID_FOR_MILLISECONDS = LANGUAGE_SELECTION_CONFIGS?.validFor?.milliseconds || 0;
    const CREATED_TIMESTAMP = LANGUAGE_SELECTED?.timestamp;

    if (
      !CREATED_TIMESTAMP
    ) {
      return false;
    }

    if (
      ((new Date()).getTime() - CREATED_TIMESTAMP) < VALID_FOR_MILLISECONDS
    ) {
      return true;
    }

    return false;
  }

  validateLanguageSelected(languageSelected: LanguageSelection) {
    if (languageSelected?.name && languageSelected?.iso2) {
      return true;
    }
    return false;
  }
}
