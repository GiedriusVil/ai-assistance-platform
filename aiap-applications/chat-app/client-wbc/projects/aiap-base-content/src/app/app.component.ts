/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EventBusServiceV1, TimestampPipe, } from 'client-services';

import { EVENT_TYPE, IEvent } from 'client-utils';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  hark,
  MIME_TYPES_AUDIO
} from 'client-utils';

@Component({
  selector: 'aiap-base-content',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  static getClassName() {
    return 'AIAPBaseContent';
  }

  static getElementTag() {
    return 'aiap-base-content';
  }

  @Input() params: any;

  title = 'aiap-base-content';

  messages: any = [];

  localMediaRecorder: MediaRecorder | undefined;

  localSpeechEventSource: any;

  isMessageBeingHandled: boolean = false;
  isMicMutted: boolean = true;
  isAudioMuted: boolean = false;
  session: any;

  initialized: boolean = false;

  audioStream: any;
  isVoiceEnabled: Boolean = false;

  source: AudioBufferSourceNode | undefined

  constructor(
    private eventBusService: EventBusServiceV1,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadSession();
    this.loadAllMessages();
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.eventBusService.subscribe?.((value: IEvent) => {
      switch (value.type) {
        case EVENT_TYPE.MESSAGE_RECEIVED: this.handleMessageReceived(value.data); break;
        case EVENT_TYPE.AUDIO_MESSAGE_RECEIVED: this.handleAudioMessage(value.data); break;
      }
    });
  }


  toggleAudioMute() {
    this.isAudioMuted = !this.isAudioMuted;
    _debugX(AppComponent.getClassName(), 'this.isAudioMuted',
    this.isAudioMuted);
  }

  async toggleAudioRecording() {
    try {
      this.isMicMutted = !this.isMicMutted;
      _debugX(AppComponent.getClassName(), 'this.isMicMutted',
      this.isMicMutted);
      if (!this.isMicMutted) {
        this.audioStream = await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          },
        );

        if (!this.localMediaRecorder) {
          this.localMediaRecorder = new MediaRecorder(
            this.audioStream,
            {
              mimeType: MIME_TYPES_AUDIO.AUDIO_WEBM
            }
          );
          this.onUserMedia(this.audioStream);
          this.localMediaRecorder.ondataavailable =
            this.handleAudioAvailable.bind(this);
        }
      }
    } catch (error) {
      _errorX(AppComponent.getClassName(), 'toggleAudioRecording - onError',
        {
          error
        });

      throw error;
    }
  }

  async playAudioMessage(buffer: ArrayBuffer) {
    try {
      _debugX(AppComponent.getClassName(), 'playAudioMessage', { this_isAudioMuted: this.isAudioMuted });
      if (!this.isAudioMuted) {
        let localAudioContext: AudioContext = new AudioContext();
        this.source = localAudioContext.createBufferSource();
        let audioBuffer = await localAudioContext.decodeAudioData(buffer);

        _debugX(AppComponent.getClassName(), 'playArrayBuffer',
          {
            audioBuffer
          });
        this.source.buffer = audioBuffer;
        const onEndedHandler = () => {
          this.isMessageBeingHandled = false;
        }
        this.source.addEventListener('ended', onEndedHandler)
        this.source.connect(localAudioContext.destination)
        _debugX(AppComponent.getClassName(), 'START_PLAY',
          {});
        this.source.start(0);
      }

    } catch (error) {
      _errorX(AppComponent.getClassName(), 'playArrayBuffer',
        {
          error
        });
    }
  }

  translateSystemMessages(message: any) {
    const TRANSLATION_KEY = message?.translationKey;
    if (
      !lodash.isEmpty(TRANSLATION_KEY) &&
      lodash.isString(TRANSLATION_KEY)
    ) {
      const TRANSLATED_MESSAGE = this.translateService.instant(TRANSLATION_KEY);
      message.text = TRANSLATED_MESSAGE;
    }
  }

  async handleMessageReceived(message: any) {
    const AUDIO_MESSAGE_BUFFER = message?.message?.audio;
    if (lodash.isArrayBuffer(AUDIO_MESSAGE_BUFFER)) {
      await this.playAudioMessage(AUDIO_MESSAGE_BUFFER);
      delete message.message.audio;
    }
    this.messages.push(message);
    this.ref.detectChanges();
    this.isMessageBeingHandled = false;
  }

  async handleAudioMessage(audioMessage) {
    const AUDIO_MESSAGE_BUFFER = audioMessage?.message?.audio;
    if (lodash.isArrayBuffer(AUDIO_MESSAGE_BUFFER)) {
      await this.playAudioMessage(AUDIO_MESSAGE_BUFFER);
    }
    delete audioMessage.message.audio;
    this.messages.push(audioMessage);
    this.ref.detectChanges();
    this.isMessageBeingHandled = false;
  }

  input: string = '';

  sendMessage(event: Event) {

    this.eventBusService.emit?.({
      type: EVENT_TYPE.SEND_MESSAGE,
      data: {
        text: this.input,
      },
    });

    this.input = '';
  }

  loadAllMessages() {
    this.eventBusService.emit?.({
      type: EVENT_TYPE.LOAD_MESSAGES,
      data: this.load.bind(this),
    });
  };


  load(messages: any) {
    this.messages = [...messages];
  }

  handleAudioAvailable(event: any) {
    if (
      !this.isMicMutted &&
      !this.isMessageBeingHandled
    ) {
      this.isMessageBeingHandled = true;
      _debugX(AppComponent.getClassName(), 'handleAudioAvailable',
      {
        this_isMicMutted: this.isMicMutted,
        this_isMessageBeingHandled: this.isMessageBeingHandled
      });

      const AUDIO_MESSAGE_BLOB = event?.data;
      this.eventBusService.emit?.({
        type: EVENT_TYPE.SEND_AUDIO_MESSAGE,
        data: {
          audio: AUDIO_MESSAGE_BLOB,
        },
      });
    }

  }

    
  loadSession() {
    this.eventBusService.emit?.({
      type: EVENT_TYPE.LOAD_SESSION,
      data: this.assignSession.bind(this),
    });
  };

  assignSession(session: any) {
    this.session = lodash.cloneDeep(session);
  }


  onUserMedia = (stream: any) => {
    this.localSpeechEventSource = hark(stream, {});
    _debugX(AppComponent.getClassName(), 'onUserMedia - stream',
      {
        this_localSpeechEventSource: this.localSpeechEventSource,
        stream
      });
    this.localSpeechEventSource.on('speaking', () => {
      _debugX(AppComponent.getClassName(), 'onUserMedia - this.localSpeechEventSource - speaking',
        {
          this_isMessageBeingHandled: this.isMessageBeingHandled,
          this_isMutted: this.isMicMutted,
        });

      this.startRecording();
    });
    this.localSpeechEventSource.on('stopped_speaking', () => {
      _debugX(AppComponent.getClassName(), 'onUserMedia - this.localSpeechEventSource - stopped_speaking',
        {
          this_isMessageBeingHandled: this.isMessageBeingHandled,
          this_isMicMutted: this.isMicMutted,
        });

      this.stopRecording();
    });

  }

  private startRecording() {
    if (
      this.localMediaRecorder &&
      this.localMediaRecorder.state === 'inactive'
    ) {
      this.localMediaRecorder.start();
    }
  }

  private stopRecording() {
    if (
      this.localMediaRecorder &&
      this.localMediaRecorder.state === 'recording'
    ) {
      this.localMediaRecorder.stop();
    }
  }
}
