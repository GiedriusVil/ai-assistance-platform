/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChatWidgetServiceV1, EventBusServiceV1, EventsServiceV1, HTMLDependenciesServiceV1, LocalStorageServiceV1, SessionServiceV1 } from 'client-services';
import { Subscription } from 'rxjs';
import * as ramda from 'ramda';

import { EVENT_TYPE, IEvent, MIME_TYPES_AUDIO, _debugX, _errorX, clearInput, hark } from 'client-utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'aiap-footer-v1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  static getElementTag() {
    return 'aiap-footer-v1';
  }

  title = 'aiap-footer-v1';

  @ViewChild('footer') footer;
  @ViewChild('textarea') textarea;
  @ViewChild('container') container;
  @ViewChild('row') row;

  @Input() config: any;
  @Input() set session(session) {
    this.sessionService.setSession(session);
    this.getIcons();
  }
  @Input() set service(service) {
    this.setClientService(service);
  }

  form: UntypedFormGroup;

  userTyping = false;

  _isInputDisabled = false;
  _isSessionEnded = false;
  _previewMode = false

  icons = [];

  localMediaRecorder: MediaRecorder | undefined;
  localSpeechEventSource: any;

  isAudioMessageBeingHandled = false;
  isMicMuted = true;
  isAudioMuted = false;

  audioStream: any;

  private eventsSubscription: Subscription;
  private eventBusSubscription: Subscription;

  private clientService: any;
  private inputHistory: string[] = [];
  private inputIndexHistory = 0;
  private arrowActionCounter = 0;
  private shiftButtonEnabled = false;
  private KEY = {
    SHIFT: 'Shift',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
  };

  constructor(
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private fb: UntypedFormBuilder,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private localStorageService: LocalStorageServiceV1,
    private eventBus: EventBusServiceV1,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.loadHTMLDependencies();
    this.initForm();
    this.initSubs();
    this.subscribeToEvents();
    this.getIcons();
    this.initTranslate();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.eventBusSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.handlePreviewMode();
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
      timestamp: new Date().getTime()
    };
    console.log('postMessage-MESSAGE: ', MESSAGE);
    this.clientService.postMessage(MESSAGE);
    this.form.reset();
    this.resetInputHeight();

    if (focus) {
      this.textarea.nativeElement.focus();
    }
    console.log('after-resetInputHeight: ', MESSAGE);
    this.handleUserInput();
    this.eventsService.eventEmit({ onInputSuggestions: '' });
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
    const CHAT_ASSETS_URL = `${this.chatWidgetService.getChatAppHostUrl()}/client-wbc/aiap-footer-v1/assets`;
    const FILE_NAME = ramda.pathOr(fileName, ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'footerPanel', propertyName, 'fileName'], this.sessionService.getSession());
    return `${CHAT_ASSETS_URL}/${FILE_NAME}`;
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

  handleUserInput() {
    this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`;
    this.eventsService.eventEmit({
      onFooterResize: this.footer.nativeElement.clientHeight + 1,
    });
  }

  setUserTyping(value: boolean): void {
    this.userTyping = value;
  }

  isInputDisabled() {
    let retVal = false;

    if (this._isInputDisabled || this._isSessionEnded) {
      retVal = true;
    }
    return retVal;
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

  downloadTranscript() {
  }

  toggleAudioMute() {
    this.isAudioMuted = !this.isAudioMuted;
    _debugX(AppComponent.getElementTag(), 'this.isAudioMuted',
      this.isAudioMuted);
  }

  async toggleAudioRecording() {
    try {
      this.isMicMuted = !this.isMicMuted;
      _debugX(AppComponent.getElementTag(), 'this.isMicMutted',
        this.isMicMuted);
      if (!this.isMicMuted) {
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
      _errorX(AppComponent.getElementTag(), 'toggleAudioRecording - onError',
        {
          error
        });

      throw error;
    }
  }

  handleAudioAvailable(event: any) {
    if (
      !this.isMicMuted &&
      !this.isAudioMessageBeingHandled
    ) {
      this.isAudioMessageBeingHandled = true;
      _debugX(AppComponent.getElementTag(), 'handleAudioAvailable',
        {
          this_isMicMuted: this.isMicMuted,
          this_isMessageBeingHandled: this.isAudioMessageBeingHandled
        });

      const AUDIO_MESSAGE_BLOB = event?.data;
      const AUDIO_MESSAGE: any = {
        audio: AUDIO_MESSAGE_BLOB
      };
      this.clientService.postAudioMessage(AUDIO_MESSAGE);
    }
  }

  onUserMedia = (stream: any) => {
    this.localSpeechEventSource = hark(stream, {});
    _debugX(AppComponent.getElementTag(), 'onUserMedia - stream',
      {
        this_localSpeechEventSource: this.localSpeechEventSource,
        stream
      });
    this.localSpeechEventSource.on('speaking', () => {
      _debugX(AppComponent.getElementTag(), 'onUserMedia - this.localSpeechEventSource - speaking',
        {
          this_isMessageBeingHandled: this.isAudioMessageBeingHandled,
          this_isMuted: this.isMicMuted,
        });

      this.startRecording();
    });
    this.localSpeechEventSource.on('stopped_speaking', () => {
      _debugX(AppComponent.getElementTag(), 'onUserMedia - this.localSpeechEventSource - stopped_speaking',
        {
          this_isMessageBeingHandled: this.isAudioMessageBeingHandled,
          this_isMicMuted: this.isMicMuted,
        });

      this.stopRecording();
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

  private subscribeToEvents() {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('audioMessagePlaying')) this.isAudioMessageBeingHandled = event['audioMessagePlaying'];
    });
    this.eventsService.sessionEmitter
      .subscribe(() => {
        this.getIcons();
      });
    this.eventBusSubscription = this.eventBus.subscribe?.((value: IEvent) => {
      if (value.type === EVENT_TYPE.LANGUAGE_CHANGE) {
        this.translateService.use(value.data);
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  _watchInputText() {
    const INPUT_TEXT = this.form.get('input').value;
    const TRIMMED_TEXT = INPUT_TEXT.trim();
    if (!this.form.invalid) {
      this.eventsService.eventEmit({ onInputSuggestions: TRIMMED_TEXT });
    }
  }

  private resetInputField() {
    this.form.reset();
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

  private setClientService(service: any) {
    this.clientService = service;
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

  private resetInputHeight(): void {
    this.textarea.nativeElement.style.height = '0px';
  }

  private initInputHistory(message: string): void {
    if (this.config?.inputHistoryEnabled) {
      this.inputHistory.push(message);
      this.inputIndexHistory = 0;
      this.arrowActionCounter = 0;
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      input: ['', [Validators.required]]
    });
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
  }

  private handlePreviewMode() {
    this._previewMode = this.localStorageService.getChatAppStateParameter('previewMode') || false;
    if (this._previewMode) this.form.get('input').disable();
  }

  private initTranslate() {
    const SELECTED_LANGUAGE = this.localStorageService.getItem('aiap-chat-app-language-selection');
    const LANGUAGE = SELECTED_LANGUAGE ? SELECTED_LANGUAGE?.iso2 : 'en';
    this.translateService.use(LANGUAGE);
  }
}
