import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, OnDestroy } from '@angular/core';

import {
  BaseModal,
} from 'client-shared-views';

@Component({
  selector: 'aca-exclamation-button',
  templateUrl: './exclamation-button.html',
  styleUrls: ['./exclamation-button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExclamationButton extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'ExclamationButton';
  }

  @Input() errorData;
  // TO_DO: put modal to different component. Make modal data more generic.
  @Input() errorMessageData


  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errorData']) {
      this.errorData = changes.checked.currentValue;
    }

    if (changes['errorMessageData']) {
      this.errorMessageData = changes.errorMessageData.currentValue;
    }
  }

  onExclamationClick() {
    this.superShow();
  }
}
