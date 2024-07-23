/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';

import { ATTACHMENT_TYPES } from "client-utils";

import {
  SessionServiceV2,
} from '.';

@Injectable()
export class AttachmentsServiceV2 {

  static getClassName() {
    return 'AttachmentsServiceV2';
  }

  constructor(
    private sessionService: SessionServiceV2,
  ) { }

  isAttachmentVisibleAiServiceSuggestions(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && (
      TYPE === ATTACHMENT_TYPES.AI_SERVICE_SUGGESTIONS ||
      TYPE === ATTACHMENT_TYPES.INTENT_SUGGESTIONS
    );
    return RET_VAL;
  }

  isAttachmentVisibleBasket(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.BASKET;
    return RET_VAL;
  }

  isAttachmentVisibleButtons(message: any): boolean {
    const TYPE = this._attachmentType(message);
    const RET_VAL = this._isBotMessage(message) && ATTACHMENT_TYPES.BUTTONS === TYPE;
    return RET_VAL;
  }

  isAttachmentVisibleButtonsList(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.BUTTONS_LIST;
    return RET_VAL;
  }

  isAttachmentVisibleDropdown(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.DROPDOWN;
    return RET_VAL;
  }

  isAttachmentVisibleFeedback(message: any): boolean {
    const RET_VAL = message?.feedbackScore || message?.sender_action?.type === ATTACHMENT_TYPES.FEEDBACK;
    return RET_VAL;
  }

  isAttachmentVisibleForm(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.FORM;
    return RET_VAL;
  }

  isAttachmentVisibleImage(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = TYPE === ATTACHMENT_TYPES.IMAGE;
    return RET_VAL;
  }

  isAttachmentVisibleIntentsMenu(message: any): boolean {
    const TYPE = this._attachmentType(message);
    const RET_VAL = this._isBotMessage(message) && ATTACHMENT_TYPES.INTENTS_MENU === TYPE;
    return RET_VAL;
  }

  isAttachmentVisibleProductList(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.PRODUCT_LIST;
    return RET_VAL;
  }

  isAttachmentVisibleTable(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.TABLE;
    return RET_VAL;
  }

  isAttachmentVisibleVideo(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.VIDEO;
    return RET_VAL;
  }

  isAttachmentVisibleWbc(message: any): boolean {
    const RET_VAL = ramda.pathOr(undefined, ['attachment', 'isWbc'], message);
    return RET_VAL;
  }

  isAttachmentVisibleWds(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    const RET_VAL = this._isBotMessage(message) && TYPE === ATTACHMENT_TYPES.WDS;
    return RET_VAL;
  }

  private _attachmentType(message: any) {
    const RET_VAL = ramda.path(['attachment', 'type'], message);
    return RET_VAL;
  }

  private _isBotMessage(message: any) {
    return message.type === 'bot';
  }

}
