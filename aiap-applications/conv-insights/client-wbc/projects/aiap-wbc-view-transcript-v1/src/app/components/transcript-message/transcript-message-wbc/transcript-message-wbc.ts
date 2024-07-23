/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { JsonEditorOptions } from 'ang-jsoneditor';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  SessionServiceV1,
  TimezoneServiceV1,
} from 'client-shared-services';

import {
  TranscriptItemMask,
  MASKED_STRING,
  TRANSCRIPTS_MESSAGES,
} from 'client-utils';

import {
  TranscriptsService,
} from 'client-services';

import {
  ConfirmModalComponent,
} from 'client-shared-components';

@Component({
  selector: 'aca-transcript-message-wbc',
  templateUrl: './transcript-message-wbc.html',
  styleUrls: ['./transcript-message-wbc.scss'],
})
export class TranscriptMessageWbc implements OnInit, AfterViewInit {

  static getClassName() {
    return 'TranscriptMessageWbc';
  }

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();
  configs: any;

  @ViewChild('wrapper') wrapper: ElementRef;

  selectedText: string;
  MASK_TEMPLATE = MASKED_STRING;
  private maskBody: TranscriptItemMask;

  constructor(
    public eventsService: EventsServiceV1,
    public timezoneService: TimezoneServiceV1,
    private notificationService: NotificationService,
    private transcriptsService: TranscriptsService,
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit(): void {
    this.jsonEditorOptions.name = 'Message';

    const TRANSCRIPT_VIEW = this.sessionService.getSession()?.application?.configuration?.views?.find(view => view.component === 'TranscriptView');

    this.configs = {
      host: TRANSCRIPT_VIEW?.configs?.message?.host ?? '',
      path: TRANSCRIPT_VIEW?.configs?.message?.path ?? '',
      isTranscript: true
    };
  }

  ngAfterViewInit(): void {
    this.wrapper.nativeElement.addEventListener('click', (event) => {
      const TARGET_CLASS_LIST = event.target.classList;
      if (TARGET_CLASS_LIST.contains('message') || TARGET_CLASS_LIST.contains('message--timestamp')) {
        this.handleMessageTextClickEvent(event);
      }
    })
  }

  ngOnDestroy(): void { }


  isUserNotMaskedMsg(text: string, type: string): boolean {
    return text && text !== MASKED_STRING && type === 'user';
  }

  handleMessageTextClickEvent(event: any) {
    const SELECTION = window.getSelection();
    if (SELECTION?.type === 'Range') {
      return;
    }
    const NEW_VALUE = lodash.cloneDeep(this.value);
    if (
      !lodash.isEmpty(NEW_VALUE)
    ) {
      NEW_VALUE.expanded = !NEW_VALUE.expanded;
    }
    this.valueChange.emit(NEW_VALUE);
    _debugX(TranscriptMessageWbc.getClassName(), 'handleMessageTextClickEvent', { event, NEW_VALUE });
  }

  messageText(message: any) {
    if (!message.text && message.sender_action) {
      return 'SENDER_ACTION';
    } else if (!message.text) {
      return 'BLANK_MESSAGE';
    }
  }

  isText(message) {
    return message && message.text ? true : false;
  }

  isButtons(attachment): boolean {
    const ATTACHMENTS = attachment?.attachments;
    return attachment && !lodash.isEmpty(ATTACHMENTS) && attachment.type === 'buttons';
  }

  isAiServiceSuggestions(attachment: any): boolean {
    const AI_SERVICES = attachment?.aiServices;
    return attachment && !lodash.isEmpty(AI_SERVICES) && attachment.type === 'AI_SERVICE_SUGGESTIONS';
  }

  isIntentSuggestions(attachment: any): boolean {
    const INTENTS = attachment?.intents;
    return attachment && !lodash.isEmpty(INTENTS) && attachment.type === 'INTENT_SUGGESTIONS';
  }

  isWdsResult(attachment): boolean {
    return attachment && attachment.type === 'wdsResults';
  }

  isImage(attachment): boolean {
    return attachment && attachment.type === 'image';
  }

  isWDS(attachment: any): boolean {
    return attachment && attachment.type === 'wds';
  }

  isCarousel(attachment): boolean {
    return attachment && attachment.type === 'carousel';
  }

  isTable(attachment): boolean {
    return attachment && attachment.type === 'table';
  }

  isSurvey(senderAction): boolean {
    return senderAction && senderAction.type === 'survey';
  }

  isMessageFromItemSelectedSenderAction(senderAction: any): boolean {
    return senderAction && senderAction?.type === 'itemSelected';
  }

  hasError(error): boolean {
    return !lodash.isEmpty(error);
  }

  isWbcAttachmentVisible(message: any): boolean {
    const RET_VAL = ramda.pathOr(false, ['attachment', 'isWbc'], message);
    return RET_VAL;
  }

  hasContent(message) {
    return (
      this.isText(message) ||
      this.isImage(message.attachment) ||
      this.isButtons(message.attachment) ||
      this.isWDS(message.attachment) ||
      this.isCarousel(message.attachment) ||
      this.isWdsResult(message.attachment) ||
      this.isSurvey(message.sender_action) ||
      this.isWbcAttachmentVisible(message)
    );
  }

  handleConfirmMessageMaskClickEvent({ messageId, utteranceId, text }): void {
    if (
      messageId &&
      utteranceId
    ) {
      const maskBody: TranscriptItemMask = {
        messageId: messageId,
        utteranceId: utteranceId,
        maskTemplate: MASKED_STRING
      };
      this.selectedText = text;
      this.maskBody = maskBody;
      this.confirmModal.show();
    }
  }

  handleMessageMaskClickEvent(): void {
    const MESSAGE_MASK_REQUEST = this.maskBody;
    const CONVERSATION_ID = this.value?.conversationId;
    _debugX(TranscriptMessageWbc.getClassName(), 'handleMessageMaskClickEvent', { MESSAGE_MASK_REQUEST, CONVERSATION_ID });
    this.eventsService.loadingEmit(true);
    this.transcriptsService.maskTranscriptMessage(MESSAGE_MASK_REQUEST)
      .subscribe((response: any) => {

        this.applyMaskToTranscriptMessage();

        _debugX(TranscriptMessageWbc.getClassName(), 'handleMessageMaskClickEvent', { response });

        this.eventsService.loadingEmit(false);
        this.confirmModal.hide();
        this.notificationService.showNotification(TRANSCRIPTS_MESSAGES.SUCCESS.MASK_MESSAGE);
      });
  }

  applyMaskToTranscriptMessage(): void {
    const MESSAGE_MASK_TEMPLATE = this.maskBody?.maskTemplate;

    const NEW_VALUE = lodash.cloneDeep(this.value);
    NEW_VALUE.text = MESSAGE_MASK_TEMPLATE;
    if (!lodash.isEmpty(NEW_VALUE?.raw?.message?.text)) {
      NEW_VALUE.raw.message.text = MESSAGE_MASK_TEMPLATE;
    }
    if (!lodash.isEmpty(NEW_VALUE?.request?.message?.text)) {
      NEW_VALUE.request.message.text = MESSAGE_MASK_TEMPLATE;
    }
    if (!lodash.isEmpty(NEW_VALUE?.aiServiceRequest?.external?.input?.text)) {
      NEW_VALUE.aiServiceRequest.external.input.text = MESSAGE_MASK_TEMPLATE;
    }
    if (!lodash.isEmpty(NEW_VALUE?.aiServiceResponse?.external?.result?.input?.text)) {
      NEW_VALUE.aiServiceResponse.external.result.input.text = MESSAGE_MASK_TEMPLATE;
    }
    this.valueChange.emit(NEW_VALUE);
  }

}
