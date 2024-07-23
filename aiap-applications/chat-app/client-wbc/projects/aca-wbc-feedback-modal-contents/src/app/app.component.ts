/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1, ConfigsServiceV1 } from 'client-services';
import { clearInput, FEEDBACK_TYPE, _debugX } from 'client-utils';
import * as lodash from 'lodash';

@Component({
  selector: 'aca-wbc-feedback-modal-contents',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static getClassName() {
    return 'AppComponent';
  }

  static getElementTag() {
    return 'aca-wbc-feedback-modal-contents';
  }

  title = 'aca-wbc-feedback-modal-contents';

  assetsUrl: any;
  @Input() parameters;

  @Output() onWbcEvent = new EventEmitter<any>();

  feedbackForm: UntypedFormGroup;

  FEEDBACK_TYPE = FEEDBACK_TYPE;

  positiveFeedbackImgFilled = false;
  negativeFeedbackImgFilled = false;

  private default!: { reason: string; comment: string };

  constructor(
    private fb: UntypedFormBuilder,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private configsService: ConfigsServiceV1,
  ) { }

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
  }

  ngOnInit() {
    this.setAssetsUrl();

    this.feedbackForm = this.fb.group({
      reason: [''],
      comment: ['']
    });

    this.loadHTMLDependencies();
  }

  setAssetsUrl() {
    if (!lodash.isEmpty(this.configsService.getHost()) && lodash.isString(this.configsService.getPath())) {
      this.assetsUrl = `${this.configsService.getHost()}${this.configsService.getPath()}/assets`;
      return;
    }

    const HOST_URL = this.chatWidgetService.getClientWbcHostUrl();
    this.assetsUrl = `${HOST_URL}/${AppComponent.getElementTag()}/assets`;
  }

  submitNegativeFeedback(): void {
    const COMMENT = this.feedbackForm.get('comment')?.value;
    const REASON = this.feedbackForm.get('reason')?.value;

    const DATA = {
      type: 'FEEDBACK',
      data: {
        feedback: {
          score: FEEDBACK_TYPE.NEGATIVE,
          reason: REASON,
          comment: COMMENT
        }
      }
    };

    this.onWbcEvent.emit(DATA)
  }

  onCloseModal() {
    this.onWbcEvent.emit({
      type: 'MODAL',
      data: {
        close: true
      }
    });
  }

  onOpenModal() {
    this.initForm();
  }

  private initForm(): void {
    this.feedbackForm.patchValue({
      reason: this.default.reason,
      comment: ''
    })
  }

  onInput(): void {
    clearInput(this.feedbackForm.get('comment'));
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
  }
}
