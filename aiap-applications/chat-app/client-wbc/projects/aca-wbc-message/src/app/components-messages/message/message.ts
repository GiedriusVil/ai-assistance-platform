/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { TranslateService } from '@ngx-translate/core';

import {
  ATTACHMENT_TYPES,
  EVENT_TYPE,
  IEvent,
  MESSAGE_TYPES,
  _debugX,
  _errorX
} from 'client-utils';

import {
  MessagesServiceV1,
  AttachmentsServiceV1,
  ConfigsServiceV1,
  NotificationServiceV1,
  SessionServiceV1,
  EventBusServiceV1
} from 'client-services';

@Component({
  selector: 'aca-chat-message',
  templateUrl: './message.html',
  styleUrls: ['./message.scss'],
})
export class Message implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'Message';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() message: any;
  @Input() index: any;

  @Output() userActionEvent = new EventEmitter<any>();
  assetsUrl: string;

  isTranscript = false;
  iconsEnabled = false;

  source: AudioBufferSourceNode | undefined

  isMessageBeingHandled = true;

  constructor(
    private messagesService: MessagesServiceV1,
    private attachmentsService: AttachmentsServiceV1,
    private configsService: ConfigsServiceV1,
    private notificationService: NotificationServiceV1,
    private sessionService: SessionServiceV1,
    private eventBusService: EventBusServiceV1,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    _debugX(Message.getClassName(), 'ngOnInit', { this_message: this.message });
    const ASSETS_LOCATION_FROM_MESSAGE: string = this.message?.wbc?.assets?.host + this.message?.wbc?.assets?.path;
    const DEFAULT_ASSETS_LOCATION = `${this.configsService.getHost()}${this.configsService.getPath()}/assets`;

    this.assetsUrl = ASSETS_LOCATION_FROM_MESSAGE || DEFAULT_ASSETS_LOCATION;

    if (!lodash.isEmpty(ASSETS_LOCATION_FROM_MESSAGE) && ASSETS_LOCATION_FROM_MESSAGE?.endsWith('/')) {
      this.assetsUrl = ASSETS_LOCATION_FROM_MESSAGE.slice(0, -1);
    }

    this.isTranscript = this.configsService.isTranscript();

    const SESSION = this.sessionService.getSession();
    this.iconsEnabled = SESSION?.engagement?.chatApp?.messages?.icons?.enabled ?? false;
  }

  ngAfterViewInit(): void {
    _debugX(Message.getClassName(), 'ngAfterViewInit', { this_message: this.message });
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(Message.getClassName(), 'ngOnChanges', { changes: changes });
    const MESSAGE = changes?.message?.currentValue;
    const AUDIO_MESSAGE = MESSAGE?.audio;
    this.playAudioMessage(AUDIO_MESSAGE);
    this.translateSystemMessages(MESSAGE);

  }

  ngOnDestroy(): void {
    _debugX(Message.getClassName(), 'ngOnDestroy', { this_message: this.message });
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  emptyMessageContents(message: any): string {
    if (message?.sender_actions) {
      return 'SENDER_ACTION';
    } else {
      return 'BLANK_MESSAGE';
    }
  }

  async playAudioMessage(buffer: ArrayBuffer) {
    try {
      if (buffer) {
        let localAudioContext: AudioContext = new AudioContext();
        this.source = localAudioContext.createBufferSource();
        let audioBuffer = await localAudioContext.decodeAudioData(buffer);

        _debugX(Message.getClassName(), 'playArrayBuffer',
          {
            audioBuffer
          });
        this.source.buffer = audioBuffer;
        const onEndedHandler = () => {
          this.handleAudioBeingHandledEvent();
        }
        this.source.addEventListener('ended', onEndedHandler)
        this.source.connect(localAudioContext.destination)
        _debugX(Message.getClassName(), 'START_PLAY',
          {});
        this.source.start(0);
      }

    } catch (error) {
      _errorX(Message.getClassName(), 'playArrayBuffer',
        {
          error
        });
    }
  }

  hasText(message: any): boolean {
    let retVal = false;
    this.handleAudioBeingHandledEvent();
    if (
      message?.text &&
      message?.text?.trim()?.length > 0
    ) {
      retVal = true;
    }
    return retVal;
  }

  translateSystemMessages(message: any) {
    const TRANSLATION_KEY = message?.translationKey;
    if (
      !lodash.isEmpty(TRANSLATION_KEY) &&
      lodash.isString(TRANSLATION_KEY)
    ) {
      const TRANSLATION_PARAMS = message?.translationParams || {};
      const TRANSLATED_MESSAGE = this.translateService.instant(TRANSLATION_KEY, TRANSLATION_PARAMS);
      this.message.text = TRANSLATED_MESSAGE;
    }
  }

  hasPiAgreementModal(message: any): boolean {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    return this.isBot(message) && TYPE === ATTACHMENT_TYPES.PI_AGREEMENT_MODAL;
  }

  hasMessageId(message: any): boolean {
    return !!ramda.pathOr(false, ['messageId'], message);
  }

  hasTitle(attribute: any): boolean {
    return attribute.key === 'title';
  }

  isNotification(message: any): boolean {
    return message?.type === MESSAGE_TYPES.NOTIFICATION;
  }

  isBotNotification(message: any): boolean {
    return message?.type === MESSAGE_TYPES.BOT_NOTIFICATION;
  }

  isBot(message: any): boolean {
    return message?.type === MESSAGE_TYPES.BOT;
  }


  botOrUserIcon(type: string): string {
    if (type === 'bot') {
      return 'persona-icon icon--bot';
    } else if (type === 'user') {
      return 'persona-icon icon--user';
    } else {
      return 'persona-icon icon--agent';
    }
  }

  applyStyle(message: any) {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    if (TYPE === 'styling') {
      const attributes = ramda.pathOr(undefined, ['attachment', 'payload'], message);
      if (attributes) return attributes;
    }
  }

  applyClass(message): string {
    const IS_ITEM_SELECTED = message?.sender_action?.type === 'itemSelected';
    return this.isTranscript && IS_ITEM_SELECTED ? 'button-selected' : undefined;
  }

  handleUserActionEvent(event: any) {
    this.userActionEvent.emit(event);
  }

  handleAudioBeingHandledEvent() {
    const AUDIO_MESSAGE_FINISHED = {
      type: "IS_AUDIO_MESSAGE_PLAYING",
      data: false
    };
    this.userActionEvent.emit(AUDIO_MESSAGE_FINISHED);
  }


  handleFeedbackClickEvent(data: any) {
    const EVENT = {
      type: "FEEDBACK",
      data: data
    };
    this.userActionEvent.emit(EVENT);
  }

  isWdsResult(attachment): boolean {
    return attachment && attachment.type === 'wdsResults';
  }
  isSurvey(senderAction): boolean {
    return senderAction && senderAction.type === 'survey';
  }
}
