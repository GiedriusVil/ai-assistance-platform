/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'aca-classifier-model-ai-skill-display-name-card',
  templateUrl: './classifier-model-ai-skill-display-name-card-v1.html',
  styleUrls: ['./classifier-model-ai-skill-display-name-card-v1.scss'],
})
export class ClassifierModelAiSkillDisplayNameCard implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassifierModelAiSkillDisplayNameCard';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() value: any;
  @Output() valueRemove = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleRemoveValueClickEvent() {
    this.valueRemove.emit();
  }
}
