/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { clearInput, _errorX } from "client-utils";
import { saveAs } from 'file-saver';

import {
  EventsServiceV1,
  ClientServiceV1,
  ZendeskLiveAgentServiceV1,
  StorageServiceV1,
  SessionServiceV1,
  DataServiceV1,
  GAcaPropsServiceV1,
} from "client-services";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('footer') footer;
  @ViewChild('textarea') textarea;
  @ViewChild('container') container;
  @ViewChild('row') row;

  @Input() config: any;

  form: UntypedFormGroup;

  userInputMessage = '';
  userTyping = false;
  endSessionIcon = '../../../assets/live-chat-session-close.svg';
  chatAssestsUrl = '../../../assets';

  _isInputDisabled = false;
  _isSessionEnded = false;
  icons = [];

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
    private clientService: ClientServiceV1,
    private storageService: StorageServiceV1,
    private sessionService: SessionServiceV1,
    private dataService: DataServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1,
    private fb: UntypedFormBuilder,
    private zendeskLiveAgentService: ZendeskLiveAgentServiceV1
  ) { }

  ngOnInit() {
    this.initForm();
    this.initSubs();
    this.subscribeToEvents();
    this.getIcons();
  }

  ngAfterViewInit() {
    this.handleWindowResize();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getIcons() {
    this.icons['downloadTranscript'] = this.getIcon('download-blue.svg', 'downloadButton');
  }

  getIcon(fileName, propertyName) {
    const FILE_NAME = ramda.pathOr(fileName, ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'footerPanel', propertyName, 'fileName'], this.sessionService.getSession());
    return `${this.chatAssestsUrl}/${FILE_NAME}`;
  }

  private subscribeToEvents() {
    this.eventsService.sessionEmitter
      .subscribe(() => {
        this.getIcons();
      });
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = ramda.pathOr(false, ['engagement', 'chatApp', 'footer', name], this.sessionService.getSession());
    return RET_VAL;
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

  _watchInputText() {
    const INPUT_TEXT = this.form.get('input').value;
    const TRIMMED_TEXT = INPUT_TEXT.trim();
    if (!this.form.invalid) {
      this.eventsService.eventEmit({ onInputSuggestions: TRIMMED_TEXT });
    }
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

  handleWindowResize() {
    if (this.footer && this.container) {
      const containerWidth = this.container.nativeElement.clientWidth - 30;
      const buttonsCount = this.row.nativeElement.childElementCount - 1;
      const footerTextAreaWidth = containerWidth - buttonsCount * 21 - buttonsCount * 15;
      setTimeout(() => {
        this.textarea.nativeElement.style.width = `${footerTextAreaWidth}px`;
        this.handleUserInput();
      }, 0);
    } else {
      setTimeout(() => {
        this.handleWindowResize();
      }, 250);
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
        _errorX(DataServiceV1.getClassName(), this.downloadTranscript.name, { err });
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

  isLiveChatInitiated(): boolean {
    return this.zendeskLiveAgentService.isLiveChatInitiated();
  }

  endLiveChatSession(): void {
    this.handleWindowResize();
    this.zendeskLiveAgentService.endLiveChat();
  }

  isChattingWith(): string {
    if (this.isLiveChatInitiated()) {
      const containerWidth = this.container.nativeElement.clientWidth - 30;
      const buttonsCount = this.row.nativeElement.childElementCount - 1;
      const footerTextAreaWidth = containerWidth - buttonsCount * 21 - buttonsCount * 15;
      this.textarea.nativeElement.style.width = `${footerTextAreaWidth - 30}px`;
    }
    return 'float-start text--area';
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
      if (event.hasOwnProperty('onWidgetResize')) this.handleWindowResize();
      if (event.hasOwnProperty('onInputFocus')) this.handleUserInputFocus(event['onInputFocus']);
      if (event.hasOwnProperty('onSuggestionMessage')) this.resetInputField();
    });
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
}
