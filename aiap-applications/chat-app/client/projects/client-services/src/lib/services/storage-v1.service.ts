/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _infoX,
  _debugX,
  _errorX,
  ConversationCookie,
  ConversationToken
} from "client-utils";

import {
  ConfigServiceV1
} from '.';

@Injectable()
export class StorageServiceV1 {

  static getClassName() {
    return 'StorageServiceV1';
  }

  chatCookie: any;
  config: any;
  transcript: [];

  constructor(
    private configService: ConfigServiceV1,
  ) {
    this.config = this.configService.getConfig();
  }

  clearAll() {
    localStorage.removeItem('conversationToken');
    if (this.chatCookie?.conversationToken) {
      localStorage.removeItem(this.chatCookie?.conversationToken);
    }
  }

  /** Update cookie and use previous options
   * Currently handles surveySubmitted
   */
  updatePrevConversation(conversationToken) {
    const prevConversation: ConversationToken = JSON.parse(localStorage.getItem('conversationToken'));
    const chatCookieWithOptions: ConversationCookie = JSON.parse(localStorage.getItem(prevConversation.token));
    localStorage.removeItem(prevConversation.token);
    chatCookieWithOptions.conversationToken = conversationToken;

    this.setConversationToken(conversationToken);
    this.setChatCookie(chatCookieWithOptions);
  }

  setChatCookie(chatCookie) {
    if (this.chatCookie?.conversationToken) {
      localStorage.removeItem(this.chatCookie?.conversationToken);
    }
    this.chatCookie = chatCookie;
    chatCookie.expire = this.calculateExpire();
    localStorage.setItem(chatCookie.conversationToken, JSON.stringify(chatCookie));
  }

  getChatCookie(conversationToken) {
    const value = localStorage.getItem(conversationToken);
    if (value && this.config.continuousChatEnabled) {
      this.chatCookie = JSON.parse(value);
      if (this.isExpired(this.chatCookie.expire)) {
        localStorage.removeItem(conversationToken);
        this.chatCookie = undefined;
      } else {
        return this.chatCookie;
      }
    }
    return undefined;
  }

  setConversationToken(token) {
    const value = {
      token: token,
      expire: this.calculateExpire()
    };
    localStorage.setItem('conversationToken', JSON.stringify(value));
  }

  getConversationToken() {
    const TOKEN_OBJECT = this.getConversationTokenObject();
    let retVal;
    if (TOKEN_OBJECT) {
      retVal = TOKEN_OBJECT.token;
    }
    return retVal;
  }

  getConversationExpiration() {
    const TOKEN_OBJECT = this.getConversationTokenObject();
    let retVal;
    if (TOKEN_OBJECT) {
      retVal = TOKEN_OBJECT.expire;
    }
    return retVal;
  }

  private getConversationTokenObject() {
    const value = localStorage.getItem('conversationToken');
    let retVal;
    if (value && this.config.continuousChatEnabled) {
      const tokenObject = JSON.parse(value);
      if (this.isExpired(tokenObject.expire)) {
        localStorage.removeItem('conversationToken');
        localStorage.removeItem(tokenObject.token);
      } else {
        retVal = tokenObject;
      }
    }

    return retVal;
  }

  private calculateExpire() {
    const expiration = new Date();
    return expiration.getTime() + Number.parseInt(this.config.sessionExpiration);
  }

  private isExpired(expirationTime) {
    return expirationTime < new Date().getTime();
  }

  isSurveySubmitted(): boolean {
    const prevConversation: ConversationToken = JSON.parse(localStorage.getItem('conversationToken'));
    if (prevConversation) {
      const chatCookieWithOptions: ConversationCookie = JSON.parse(localStorage.getItem(prevConversation.token));
      return chatCookieWithOptions?.surveySubmitted === undefined;
    }
    return true;
  }

  submitSurvey() {
    this.chatCookie.surveySubmitted = true;
    this.setChatCookie(this.chatCookie);
  }

  _saveTranscript(transcript) {
    this.chatCookie.transcript = transcript;
    this.setChatCookie(this.chatCookie);
    this.setConversationToken(this.chatCookie.conversationToken);
  }

  saveTranscript(transcript) {
    this.transcript = transcript;
  }

  resetLocalStorage() {
    const LOCAL_USER = JSON.parse(window.localStorage.getItem('user'));
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(LOCAL_USER));
  }

  restart() {
    const LOCAL_USER = JSON.parse(window.localStorage.getItem('user'));
    const PI_CONFIRMATION = ramda.pathOr(null, ['piConfirmation', 'confirmed'], LOCAL_USER);
    const TIME = ramda.pathOr(null, ['piConfirmation', 'timestamp'], LOCAL_USER);
    localStorage.clear();
    const VALUE = {
      piConfirmation: {
        confirmed: PI_CONFIRMATION,
        timestamp: TIME
      }
    };
    localStorage.setItem('user', JSON.stringify(VALUE));
  }

  setUser(session) {
    try {
      const USER = ramda.path(['user'], session);
      const PI_CONFIRMATION = ramda.path(['confirmations', 'piAgreement'], session);
      const TIME = new Date().getTime();
      const VALUE = {
        ...USER,
        piConfirmation: {
          confirmed: PI_CONFIRMATION,
          timestamp: TIME
        }
      };
      const LOCAL_USER = JSON.parse(window.localStorage.getItem('user'));
      const CONFIRMATION = ramda.pathOr(null, ['piConfirmation', 'confirmed'], LOCAL_USER);
      if (lodash.isNull(CONFIRMATION)) {
        localStorage.setItem('user', JSON.stringify(VALUE));
      }
    } catch (error) {
      _debugX(StorageServiceV1.getClassName(), 'setUser', { error });
    }
  }

  _getTranscript() {
    _infoX(StorageServiceV1.getClassName, '_getTranscript');
    return this.chatCookie.transcript || [];
  }

  getTranscript() {
    return this.transcript || [];
  }

  getPiConfirmation() {
    let localUser;
    try {
      localUser = JSON.parse(window.localStorage.getItem('user'));
      _debugX(StorageServiceV1.getClassName(), 'getPiConfirmation', { localUser });
      if (
        lodash.isEmpty(localUser)
      ) {
        localUser = {};
      }
      let localStoredPiConfirmationState = ramda.pathOr(null, ['piConfirmation', 'confirmed'], localUser);
      let localStoredPiConfirmationTimestamp = ramda.pathOr(null, ['piConfirmation', 'timestamp'], localUser);

      const TODAY = new Date();
      const ACCEPTED = new Date(localStoredPiConfirmationTimestamp);
      const PI_LIMIT = new Date(ACCEPTED.setMonth(ACCEPTED.getMonth() + 3));
      if (TODAY > PI_LIMIT) {
        localStoredPiConfirmationState = null;
        localUser.piConfirmation = {
          confirmed: localStoredPiConfirmationState,
          timestamp: TODAY
        }
        window.localStorage.setItem('user', JSON.stringify(localUser));
      }
      return localStoredPiConfirmationState
    } catch (error) {
      _debugX(StorageServiceV1.getClassName(), 'getPiConfirmation', { error });

      return null;
    }
  }

  getUserSelectedLanguage() {
    try {
      const LANGUAGE_SELECTED = JSON.parse(window.localStorage.getItem('aiap-chat-app-language-selection'));
      return LANGUAGE_SELECTED;
    } catch (error) {
      _debugX(StorageServiceV1.getClassName(), 'getUserSelectedLanguage', { error });

      return null;
    }
  }
}
