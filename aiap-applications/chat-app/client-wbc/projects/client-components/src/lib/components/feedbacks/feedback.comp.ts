/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  FEEDBACK_TYPE,
} from 'client-utils';

import {
  ConfigsServiceV1,
  EventsServiceV1,
  SessionServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-wbc-feedback',
  templateUrl: './feedback.comp.html',
  styleUrls: ['./feedback.comp.scss'],
})
export class FeedbackComp implements OnInit, OnChanges {

  static getClassName() {
    return 'FeedbackComp';
  }

  @ViewChild('feedbackContent') feedbackContent;

  @Input() assetsUrl;

  @Input() message;
  @Input() suffix;

  @Output() onFeedbackClickEvent = new EventEmitter<any>();

  FEEDBACK_TYPE = FEEDBACK_TYPE;

  feedbackScore = null;
  positiveFeedbackImgFilled = false;
  negativeFeedbackImgFilled = false;

  isTranscript = false;

  constructor(
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private configsService: ConfigsServiceV1,
  ) { }

  icons: any = {};

  ngOnInit() {
    this.getIcons();
    this.isTranscript = this.configsService.isTranscript();
  }

  getIcons() {
    this.icons['positive'] = this.getIcon('thumbs-up.svg', 'positive');
    this.icons['negative'] = this.getIcon('thumbs-down.svg', 'negative');
    this.icons['selectedPositive'] = this.getIcon('thumbs-up-filled.svg', 'selectedPositive');
    this.icons['selectedNegative'] = this.getIcon('thumbs-down-filled.svg', 'selectedNegative');
  }

  getIcon(fileName, propertyName) {
    const ICON = ramda.path(
      ['engagement', 'chatApp', 'assets', 'icons', 'feedback', propertyName],
      this.sessionService.getSession()
    );

    const ICON_NAME = ICON?.fileName ?? fileName;
    let retVal = `${this.assetsUrl}/${ICON_NAME}`;

    if (!lodash.isEmpty(ICON?.url)) {
      retVal = ICON?.url;
    }

    return retVal;
  }

  ngOnChanges() {
    // Currently this is not the only feedbackScore that is used in the template. As Feedback component is also used by other component removing it might break them.
    // message?.feedback?.feedbackScore is directly used in the template because no method is trigered when parent component changes properties of message object, thus if we want to have multiple feedback components on the same message we need to use message?.feedback?.feedbackScore.
    // TODO: rework of the feedback component so that there wouldnt be such partial duplications, possibly use two way binding.
    this.feedbackScore = this.message?.feedback?.feedbackScore ?? this.message?.feedback;
  }
  provideFeedback(message: any, score: any): void {
    const UTTERANCE_ID = ramda.pathOr(null, ['utteranceId'], message);
    const MESSAGE_ID = ramda.pathOr(null, ['messageId'], message);
    const PARENT_ID = ramda.pathOr(null, ['parentId'], message);
    const CONVERSATION_ID = ramda.path(['conversationId'], message);

    if (score === FEEDBACK_TYPE.NEGATIVE) {
      const FEEDBACK = ramda.mergeAll([
        {
          conversationId: CONVERSATION_ID,
          messageId: MESSAGE_ID,
          utteranceId: UTTERANCE_ID,
          parentId: PARENT_ID,
        }
      ]);

      this.eventsService.eventEmit({
        onFeedbackShow: true,
        onFeedbackScoreChange: (data) => { this.emitFeedbackClickEmitEvent(data) },
        feedback: FEEDBACK
      });
    } else {
      const DATA = {
        feedback: {
          conversationId: CONVERSATION_ID,
          messageId: MESSAGE_ID,
          utteranceId: UTTERANCE_ID,
          parentId: PARENT_ID,
          score: FEEDBACK_TYPE.POSITIVE,
          reason: null,
          comment: ''
        }
      };
      this.emitFeedbackClickEmitEvent(DATA);
    }
  }

  private emitFeedbackClickEmitEvent(data: any) {
    this.feedbackScore = data?.feedback?.score;
    this.onFeedbackClickEvent.emit(data);
  }

  isFeedbackDisabled() {
    const DISABLED_FEEDBACK = ramda.path(['attachment', 'disableFeedback'], this.message);
    if (!lodash.isEmpty(DISABLED_FEEDBACK)) {
      return DISABLED_FEEDBACK;
    } else {
      return false;
    }
  }
}
