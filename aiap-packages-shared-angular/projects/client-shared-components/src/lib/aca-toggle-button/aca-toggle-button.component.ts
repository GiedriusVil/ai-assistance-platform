/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'aca-toggle-button',
  templateUrl: './aca-toggle-button.component.html',
  styleUrls: ['./aca-toggle-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcaToggleButtonComponent implements OnInit {
  @Input() onText;
  @Input() offText;
  @Input() checked;
  @Input() id;
  @Output() valueChanged = new EventEmitter<boolean>();

  @ViewChild('acaToggle', { static: true }) acaToggle;

  constructor() { }

  ngOnInit(): void {
    this.acaToggle.nativeElement.checked = this.checked;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      this.checked = changes.checked.currentValue;
      this.acaToggle.nativeElement.checked = this.checked;
    }
    if (changes['id']) {
      this.id = changes.id.currentValue;
    }
  }

  onValueChange(event) {
    this.acaToggle.nativeElement.checked = event.target.checked;
    this.checked = event.target.checked;
    this.valueChanged.emit(this.acaToggle.nativeElement.checked);
  }
}
