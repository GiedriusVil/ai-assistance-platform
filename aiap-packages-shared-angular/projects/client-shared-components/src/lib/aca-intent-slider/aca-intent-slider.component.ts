/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Accordion } from 'carbon-components';
import { LocalStorageServiceV1 } from 'client-shared-services';
import { pick, pathOr } from 'ramda';


@Component({
  selector: 'aca-intent-slider',
  templateUrl: './aca-intent-slider.component.html',
  styleUrls: ['./aca-intent-slider.component.scss']
})
export class AcaIntentSliderComponent implements OnInit {
  @Input() title;
  @Output() confidenceChanged = new EventEmitter<number>();

  @ViewChild('dataaccordion', { static: true }) dataaccordion;

  @ViewChild('slider', { static: true }) slider;

  accordion: any = null;
  value: any = null;

  constructor(
    private localStorageService: LocalStorageServiceV1,
  ) { }

  ngOnInit(): void {
    this.accordion = Accordion.create(this.dataaccordion.nativeElement);
    this.value = pathOr(0.5, ['confidence'], pick(['confidence'], this.localStorageService.get('filters')));
  }

  onConfidenceChange($event) {
    setTimeout(() => {
      this.confidenceChanged.emit(+this.value);
    }, 20);
  }

  ngOnDestroy(): void {
    this.accordion.release();
  }
}
