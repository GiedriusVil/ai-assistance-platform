/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { _debugX, _errorX } from 'client-utils';

import {
  FLOW_ANSWERS,
  SLIDER_VALUES,
  BACKGROUND_CLASSES
} from './constants';
@Component({
  selector: 'aiap-answer-slider',
  templateUrl: './answer-slider.comp.html',
  styleUrls: ['./answer-slider.comp.scss']
})
export class AnswerSliderComp implements OnInit {

  static getClassName() {
    return 'AnswerSliderComp';
  }

  @ViewChild('answerBar') sliderRef: ElementRef<HTMLInputElement>;

  @Input() initValue: any;
  @Input() questionDetails: any = {};
  @Input() refreshSlider: boolean = false;
  @Output() newAnswerEvent = new EventEmitter<{}>();

  latestRefreshSliderValue = false;
  inputSlider = new FormControl();
  barBackground: string;

  ngOnInit() {
    this.inputSlider.setValue(this.initValue);
    this.barBackground = this.getBarBackground(this.initValue);
    this.inputSlider.valueChanges.subscribe(value => {
      this.handleInputRangeChange(value);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshSlider.currentValue !== this.latestRefreshSliderValue) {
      this.barBackground = this.getBarBackground(SLIDER_VALUES.UNANSWERED);
      this.inputSlider.setValue(SLIDER_VALUES.UNANSWERED);
      this.latestRefreshSliderValue = changes.refreshSlider.currentValue;
    }
  }

  handleInputRangeChange(barValue) {
    const SLIDER_VALUE = this.calculateBarAnswer(barValue);
    const BAR_OUTPUT = {
      kcfr: this.questionDetails?.kcfr,
      answer: SLIDER_VALUE,
      actualNode: this.questionDetails?.details?.node,
      nextNode: this.questionDetails?.details?.[SLIDER_VALUE]
    }
    this.barBackground = this.getBarBackground(barValue);
    this.newAnswerEvent.emit(BAR_OUTPUT);
  }

  calculateBarAnswer(value) {
    const RET_VAL = value > SLIDER_VALUES.POSITIVE_LIMIT ?
      FLOW_ANSWERS.POSITIVE :
      value < SLIDER_VALUES.NEGATIVE_LIMIT ?
        FLOW_ANSWERS.NEGATIVE :
        FLOW_ANSWERS.UNANSWERED;
    return RET_VAL;
  }

  getBarBackground(barValue) {
    const RET_VAL = barValue > SLIDER_VALUES.POSITIVE_LIMIT ?
      BACKGROUND_CLASSES.RIGHT_LINE :
      barValue < SLIDER_VALUES.NEGATIVE_LIMIT ?
        BACKGROUND_CLASSES.LEFT_LINE :
        BACKGROUND_CLASSES.NO_LINE;
    return RET_VAL;
  }
}
