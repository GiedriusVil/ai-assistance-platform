/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _infoX,
  _errorX,
  _debugX,
  ConversationCookie,
  ConversationToken,
} from 'client-utils';

import {
  ConfigServiceV2
} from '.';

@Injectable()
export class StorageServiceV2 {

  static getClassName() {
    return 'StorageServiceV2';
  }

  chatCookie: any;
  config: any;
  transcript: any = [];

  constructor(
    private configService: ConfigServiceV2
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
  updatePrevConversation(conversationToken: any) {
    const prevConversation: ConversationToken = JSON.parse(localStorage.getItem('conversationToken') ?? '');
    const chatCookieWithOptions: ConversationCookie = JSON.parse(localStorage.getItem(prevConversation.token) ?? '');
    localStorage.removeItem(prevConversation.token);
    chatCookieWithOptions.conversationToken = conversationToken;

    this.setConversationToken(conversationToken);
    this.setChatCookie(chatCookieWithOptions);
  }

  clearTranscript() {
    this.transcript = [];
  }

  setChatCookie(chatCookie: any) {
    this.chatCookie = chatCookie;
    chatCookie.expire = this.calculateExpire();
    localStorage.setItem(chatCookie.conversationToken, JSON.stringify(chatCookie));
  }

  getChatCookie(conversationToken: any) {
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

  setConversationToken(token: any) {
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

  private isExpired(expirationTime: any) {
    return expirationTime < new Date().getTime();
  }

  isSurveySubmitted(): boolean {
    const prevConversation: ConversationToken = JSON.parse(localStorage.getItem('conversationToken') ?? '');
    if (prevConversation) {
      const chatCookieWithOptions: ConversationCookie = JSON.parse(localStorage.getItem(prevConversation.token) ?? '');
      return chatCookieWithOptions?.surveySubmitted === undefined;
    }
    return true;
  }

  submitSurvey() {
    this.chatCookie.surveySubmitted = true;
    this.setChatCookie(this.chatCookie);
  }

  _saveTranscript(transcript: any) {
    this.chatCookie.transcript = transcript;
    this.setChatCookie(this.chatCookie);
    this.setConversationToken(this.chatCookie.conversationToken);
  }

  saveTranscript(transcript: any) {
    this.transcript = transcript;
  }

  _getTranscript() {
    _infoX(StorageServiceV2.getClassName(), '_getTranscript');
    return this.chatCookie.transcript || [];
  }

  getTranscript() {
    return this.transcript || [];
  }

  getPiConfirmation() {
    let localUser;

    let piConfirmation;
    let piConfirmationState;
    let piConfirmationTimestamp;
    try {
      localUser = JSON.parse(window.localStorage.getItem('user') ?? '');

      piConfirmation = localUser?.piConfirmation;
      piConfirmationState = ramda.pathOr(null, ['confirmed'], piConfirmation);
      piConfirmationTimestamp = ramda.pathOr(null, ['timestamp'], piConfirmation);

      const TODAY = new Date();
      const ACCEPTED = new Date(piConfirmationTimestamp ?? '');
      const PI_LIMIT = new Date(ACCEPTED.setMonth(ACCEPTED.getMonth() + 3));

      if (TODAY > PI_LIMIT) {
        piConfirmationState = null;
        if (
          lodash.isEmpty(localUser)
        ) {
          localUser = {};
        }
        localUser.piConfirmation = {
          confirmed: piConfirmationState,
          timestamp: TODAY
        }
        window.localStorage.setItem('user', JSON.stringify(localUser));
      }
      return piConfirmationState;
    } catch (error) {
      _errorX(StorageServiceV2.getClassName(), 'getPiConfirmation', { error });
      throw error;
    }
  }

  getUserSelectedLanguage() {
    try {
      const LANGUAGE_SELECTED = JSON.parse(window.localStorage.getItem('aiap-chat-app-language-selection'));
      return LANGUAGE_SELECTED;
    } catch (error) {
      _debugX(StorageServiceV2.getClassName(), 'getUserSelectedLanguage', { error });

      return null;
    }
  }
}
