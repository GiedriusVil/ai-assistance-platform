/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as ramda from 'ramda';
import { clearInput, _errorX, _debugX, hark, MIME_TYPES_AUDIO, EVENT_TYPE, IEvent } from "client-utils";
import { saveAs } from 'file-saver';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  ClientServiceV2,
  ZendeskLiveAgentServiceV2,
  LeftPanelServiceV1,
  SessionServiceV2,
  StorageServiceV2,
  DataServiceV2,
  GAcaPropsServiceV1,
  LocalStorageServiceV1,
} from "client-services";

@Component({
  selector: 'aca-chat-footer-panel',
  templateUrl: './chat-footer.panel.html',
  styleUrls: ['./chat-footer.panel.scss'],
})
export class ChatFooterPanel implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ChatWindowFooterPanel';
  }

  @ViewChild('footer') footer;
  @ViewChild('textarea') textarea;
  @ViewChild('container') container;
  @ViewChild('row') row;

  @Input() config: any;

  form: UntypedFormGroup;

  voiceEnabled = true;

  userInputMessage = '';
  userTyping = false;
  endSessionIcon = '../../../assets/live-chat-session-close.svg';

  _isInputDisabled = false;
  _isSessionEnded = false;
  _previewMode = false;
  chatAssestsUrl: string = undefined;
  icons = [];

  localMediaRecorder: MediaRecorder | undefined;

  localSpeechEventSource: any;

  isAudioMessageBeingHandled: boolean = false;
  isMicMutted: boolean = true;
  isAudioMuted: boolean = true;


  audioStream: any;

  private eventsSubscription: Subscription;

  private inputHistory: string[] = [];
  private inputIndexHistory = 0;
  private arrowActionCounter = 0;
  private shiftButtonEnabled = false;
  private KEY = {
    SHIFT: 'Shift',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown'
  };

  constructor(
    private eventsService: EventsServiceV1,
    private clientService: ClientServiceV2,
    private storageService: StorageServiceV2,
    private fb: UntypedFormBuilder,
    private zendeskLiveAgentService: ZendeskLiveAgentServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
    private sessionService: SessionServiceV2,
    public leftPanelService: LeftPanelServiceV1,
    private dataService: DataServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private localStorageService: LocalStorageServiceV1
  ) { }

  ngOnInit() {
    this.initForm();
    this.initSubs();
    this.subscribeToEvents();
    this.getAssetsUrl();
    this.getIcons();
  }

  ngAfterViewInit() {
    this.handlePreviewMode();
    this.handleChatAppVoice();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getAssetsUrl() {
    this.chatAssestsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
    this.endSessionIcon = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets/live-chat-session-close.svg";
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = ramda.pathOr(false, ['engagement', 'chatApp', 'footer', name], this.sessionService.getSession());
    return RET_VAL;
  }

  getIcons() {
    this.icons['liveChatSessionClose'] = this.getIcon('live-chat-session-close.svg', 'liveChatSessionClose');
    this.icons['sendMessage'] = this.getIcon('send-alt-filled.svg', 'sendButton');
    this.icons['downloadTranscript'] = this.getIcon('download-blue.svg', 'downloadButton');
    this.icons['volumeUp'] = this.getIcon('volume-up-filled-blue.svg', 'volumeUp');
    this.icons['volumeMute'] = this.getIcon('volume-mute-filled-blue.svg', 'volumeMute');
    this.icons['microphone'] = this.getIcon('microphone-filled-blue.svg', 'microphone');
    this.icons['microphoneOff'] = this.getIcon('microphone-off-blue.svg', 'microphoneOff');
  }

  getIcon(fileName, propertyName) {
    const FILE_NAME = ramda.pathOr(fileName, ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'footerPanel', propertyName, 'fileName'], this.sessionService.getSession());
    return `${this.chatAssestsUrl}/${FILE_NAME}`;
  }

  private subscribeToEvents() {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('audioMessagePlaying')) this.isAudioMessageBeingHandled = event['audioMessagePlaying'];
    });
    this.eventsService.sessionEmitter
      .subscribe(() => {
        this.getIcons();
      });
  }

  toggleAudioMute() {
    this.isAudioMuted = !this.isAudioMuted;
    this.localStorageService.setChatAppStateParameter('audioMuted', this.isAudioMuted);
    _debugX(ChatFooterPanel.getClassName(), 'this.isAudioMuted',
      this.isAudioMuted);
  }

  onEventBus(value: IEvent) {
    switch (value.type) {
      case EVENT_TYPE.IS_AUDIO_MESSAGE_PLAYING: this.isAudioMessageBeingHandled = value.data; break;
    }
  }

  isInputDisabled() {
    let retVal = false;
    const TRANSCRIPT = this.storageService.getTranscript();

    if (this._isInputDisabled || this._isSessionEnded || (TRANSCRIPT && TRANSCRIPT.length === 0)) {
      retVal = true;
    }
    return retVal;
  }

  handleUserInput() {
    this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`;
    this.eventsService.eventEmit({ onFooterResize: this.footer.nativeElement.clientHeight + 1 });
  }

  onInput() {
    this.resetInputHeight();
    clearInput(this.form.get('input'));
    this.handleUserInput();
    this._watchInputText();
    this.clientService.handleUserTyping(true);
  }

  handleUserInputFocus(focus: boolean) {
    if (focus) {
      this.textarea.nativeElement.focus();
    } else {
      this.textarea.nativeElement.blur();
    }
  }

  async toggleAudioRecording() {
    try {
      this.isMicMutted = !this.isMicMutted;
      this.localStorageService.setChatAppStateParameter('micMuted', this.isMicMutted);
      _debugX(ChatFooterPanel.getClassName(), 'this.isMicMutted',
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
      _errorX(ChatFooterPanel.getClassName(), 'toggleAudioRecording - onError',
        {
          error
        });

      throw error;
    }
  }

  handleAudioAvailable(event: any) {
    if (
      !this.isMicMutted &&
      !this.isAudioMessageBeingHandled
    ) {
      this.isAudioMessageBeingHandled = true;
      _debugX(ChatFooterPanel.getClassName(), 'handleAudioAvailable',
        {
          this_isMicMutted: this.isMicMutted,
          this_isMessageBeingHandled: this.isAudioMessageBeingHandled
        });

      const AUDIO_MESSAGE_BLOB = event?.data;
      const AUDIO_MESSAGE: any = {
        audio: AUDIO_MESSAGE_BLOB,
        audioMuted: this.isAudioMuted
      };
      this.clientService.postAudioMessage(AUDIO_MESSAGE);
    }
  }

  onUserMedia = (stream: any) => {
    this.localSpeechEventSource = hark(stream, {});
    _debugX(ChatFooterPanel.getClassName(), 'onUserMedia - stream',
      {
        this_localSpeechEventSource: this.localSpeechEventSource,
        stream
      });
    this.localSpeechEventSource.on('speaking', () => {
      _debugX(ChatFooterPanel.getClassName(), 'onUserMedia - this.localSpeechEventSource - speaking',
        {
          this_isMessageBeingHandled: this.isAudioMessageBeingHandled,
          this_isMutted: this.isMicMutted,
        });

      this.startRecording();
    });
    this.localSpeechEventSource.on('stopped_speaking', () => {
      _debugX(ChatFooterPanel.getClassName(), 'onUserMedia - this.localSpeechEventSource - stopped_speaking',
        {
          this_isMessageBeingHandled: this.isAudioMessageBeingHandled,
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

  postMessage(event: Event, focus: boolean) {
    const message = this.form.get('input').value;
    if (this.form.invalid || !message.length) {
      return;
    }

    event.preventDefault();

    if (this.isInputDisabled()) {
      return;
    }

    this.clientService.handleUserTyping(false);

    this.initInputHistory(message);
    const MESSAGE = {
      type: 'user',
      text: message,
      audioMuted: this.isAudioMuted,
      timestamp: new Date().getTime()
    };
    this.clientService.postMessage(MESSAGE);
    this.form.reset();
    this.resetInputHeight();

    if (focus) {
      this.textarea.nativeElement.focus();
    }
    this.handleUserInput();
    this.eventsService.eventEmit({ onInputSuggestions: '' });
  }

  downloadTranscript() {
    const TRANSCRIPT = this.storageService.getTranscript();
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    const ASSISTANT_NAME = this.sessionService.getSession()?.engagement?.assistantDisplayName;
    const TIMESTAMP = new Date().getTime();
    G_ACA_PROPS['assistantDisplayName'] = ASSISTANT_NAME;

    const DOWNLOAD_PARAMS = {
      transcript: TRANSCRIPT,
      configuration: G_ACA_PROPS
    }

    this.dataService.downloadTranscript(DOWNLOAD_PARAMS).subscribe(
      PDF_DATA => {
        const PDF_BLOB = new Blob([PDF_DATA], { type: 'application/pdf' });
        saveAs(PDF_BLOB, ASSISTANT_NAME + '_transcript_' + TIMESTAMP + '.pdf');
      },
      err => {
        _errorX(DataServiceV2.getClassName(), this.downloadTranscript.name, { err });
      }
    );
  }

  setUserTyping(value: boolean): void {
    if (this.isLiveChatInitiated()) {
      this.zendeskLiveAgentService.typingToAgent(value);
    } else {
      this.userTyping = value;
    }
  }

  _watchInputText() {
    const INPUT_TEXT = this.form.get('input').value;
    const TRIMMED_TEXT = INPUT_TEXT.trim();
    if (!this.form.invalid) {
      this.eventsService.eventEmit({ onInputSuggestions: TRIMMED_TEXT });
    }

  }

  isLiveChatInitiated(): boolean {
    return this.zendeskLiveAgentService.isLiveChatInitiated();
  }

  endLiveChatSession(): void {
    this.zendeskLiveAgentService.endLiveChat();
  }

  keyUp(event): void {
    if (event.key === this.KEY.SHIFT) {
      this.shiftButtonEnabled = false;
    }
    if (event.key === this.KEY.ARROW_UP) {
      this.arrowUp();
    }
  }

  keyDown(event): void {
    if (event.key === this.KEY.SHIFT) {
      this.shiftButtonEnabled = true;
    }
    if (event.key === this.KEY.ARROW_DOWN) {
      this.arrowDown();
    }
  }

  onMouseEndZendeskSessionOver() {
    this.endSessionIcon = '../../../assets/live-chat-session-close-filled.svg'
  }

  onMouseEndZendeskSessionOut() {
    this.endSessionIcon = '../../../assets/live-chat-session-close.svg'
  }

  private arrowUp(): void {
    if (this.isInputHistoryEnabled(this.config?.inputHistoryEnabled, this.inputHistory.length, this.shiftButtonEnabled)) {
      return;
    }
    if (this.arrowActionCounter >= this.inputHistory.length) {
      return;
    }
    if (this.inputIndexHistory === 0) {
      this.inputIndexHistory = this.inputHistory.length;
    }
    this.inputIndexHistory -= 1;
    this.arrowActionCounter += 1;
    this.form.get('input').setValue(this.inputHistory[this.inputIndexHistory]);
  }

  private arrowDown(): void {
    if (this.isInputHistoryEnabled(this.config?.inputHistoryEnabled, this.inputHistory.length, this.shiftButtonEnabled)) {
      return;
    }
    if (this.arrowActionCounter <= 0) {
      return;
    }

    this.inputIndexHistory += 1;
    this.arrowActionCounter -= 1;
    this.form.get('input').setValue(this.inputHistory[this.inputIndexHistory]);
  }

  private initForm(): void {
    this.form = this.fb.group({
      input: ['', [Validators.required]]
    });
  }

  private initSubs(): void {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onInputDisable')) this._isInputDisabled = event['onInputDisable'];
      if (event.hasOwnProperty('onSessionEnded')) this._isSessionEnded = event['onSessionEnded'];
      if (event.hasOwnProperty('onInputFocus')) this.handleUserInputFocus(event['onInputFocus']);
      if (event.hasOwnProperty('onSuggestionMessage')) this.resetInputField();
    });
  }

  private handleChatAppVoice(){
    const IS_AUDIO_MUTED = this.localStorageService.getChatAppStateParameter('audioMuted');
    this.isAudioMuted = IS_AUDIO_MUTED ?? true;
  }

  private resetInputHeight(): void {
    this.textarea.nativeElement.style.height = '0px';
  }

  private resetInputField() {
    this.form.reset();
  }

  private isInputHistoryEnabled(inputHistoryEnabled: boolean, inputHistoryLength: number, shiftButtonEnabled: boolean): boolean {
    let retVal = false;
    if (!inputHistoryEnabled) {
      retVal = true;
    }
    if (!shiftButtonEnabled) {
      retVal = true;
    }
    if (inputHistoryLength === 0) {
      retVal = true;
    }
    return retVal;
  }

  private initInputHistory(message: string): void {
    if (this.config?.inputHistoryEnabled) {
      this.inputHistory.push(message);
      this.inputIndexHistory = 0;
      this.arrowActionCounter = 0;
    }
  }

  private handlePreviewMode() {
    this._previewMode = this.localStorageService.getChatAppStateParameter('previewMode') || false;
    if (this._previewMode) this.form.get('input').disable();
  }
}
