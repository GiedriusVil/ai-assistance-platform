/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, takeUntil } from 'rxjs/operators';

interface AcaInputField {
  /**
   * @param searchLabel The label above the search bar.
   * @param searchId Unique id for the html search element.
   * @param placeholder The placeholder text in the search bar.
   * @param inputData The data used for two-way binding.
   * @param customCallback Custom callback for passing data to a parent component.
   */
  searchLabel: string;
  searchId: number;
  placeholder: string;
  inputData: any;

  customCallback: (args: any) => void;
}

@Component({
  selector: 'aca-input-field',
  templateUrl: './field-input.html',
  styleUrls: ['./field-input.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldInput implements OnInit, AcaInputField, OnDestroy {
  selectedPage = 1;
  component = { name: '', path: 'main-view/' };

  @Input() searchLabel: string;
  @Input() searchId: number;
  @Input() placeholder: string;
  @Input() debounceTime = 1000;
  @Input() inputData: any;

  private _destroyed$: Subject<void> = new Subject();
  private _inputTextChanged: Subject<string> = new Subject<string>();

  @Input() customCallback: (args: any) => void;

  @Output() inputDataChange = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.url.subscribe(url => (this.component.path += url[0].path));
    this.route.data.subscribe(data => (this.component.name = data.componentInRoleTable));
    this._inputTextChanged
      .pipe(
        debounceTime(this.debounceTime),
        takeUntil(this._destroyed$)
      )
      .subscribe(inputData => {
        this.inputData = inputData;
        this.inputDataChange.emit(this.inputData);
      })
  }

  onSearchBarChange(inputText: string) {
    this._inputTextChanged.next(inputText);

    if (this.customCallback) this.customCallback({});
    if (this.component.name === 'AuditsComponent') {
      this.router.navigate([this.component.path], { queryParams: { page: this.selectedPage } });
    }
  }

  getCloseClass() {
    if (!this.inputData) {
      return 'bx--search-close--hidden';
    }
    return;
  }

  resetSearch() {
    this.inputData = null;
    this.inputDataChange.emit(this.inputData);
    if (this.customCallback) this.customCallback({});
    if (this.component.name === 'AuditsComponent') {
      this.router.navigate([this.component.path], { queryParams: { page: this.selectedPage } });
    }
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
