/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface AcaDropdownField {
  /**
   * @param dropdownLabel The label above the dropdown.
   * @param dataSource Iterable data source to be used.
   * @param counter Number of items to be checked from the data source.
   * @param placeholder The placeholder text in the dropdown.
   * @param implementsChecklist Shows if custom html should implement checklists or not.
   * @param customCallback Custom callback for passing data to a parent component.
   * @param inputData The data used for two-way binding.
   */
  dropdownLabel: string;
  dataSource: any;
  counter: number;
  placeholder: string;
  implementsChecklist: boolean;
  inputData: any;

  customCallback: (args: any) => void;
}

@Component({
  selector: 'aca-dropdown-field',
  templateUrl: './field-dropdown.html',
  styleUrls: ['./field-dropdown.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldDropdown implements OnInit, AcaDropdownField {
  component = { name: '', path: 'main-view/' };
  selectedPage = 1;
  dataExpanded = false;
  applyData = false;

  @Input() dropdownLabel: string;
  @Input() dataSource: any;
  @Input() counter: number;
  @Input() placeholder: string;
  @Input() implementsChecklist: boolean;
  @Input() inputData: any;

  @Input() customCallback: (args: any) => void;

  @Output() inputDataChange = new EventEmitter<any>();

  @ViewChild('dataFilter', { static: false }) dataFilter;

  constructor(private route: ActivatedRoute, private router: Router) { }

  @HostListener('document:click', ['$event'])
  closeDropdown(event) {
    if (this.dataExpanded && !this.dataFilter.nativeElement.contains(event.target)) this.changeDropdown(false);
  }

  ngOnInit() {
    this.route.url.subscribe(url => (this.component.path += url[0].path));
    this.route.data.subscribe(data => (this.component.name = data.componentInRoleTable));
  }

  uncheckItems(event) {
    event.stopPropagation();

    if (this.component.name === 'UtterancesComponent' || this.component.name === 'ReportsComponent') {
      this.dataSource = this.dataSource.map(({ serviceId, skills }) => ({
        serviceId: serviceId,
        skills: skills.map(skill => ({
          ...skill,
          checked: false
        }))
      }));
    }

    this.counter = 0;
    this.dataExpanded = false;
    this.customCallback({});
  }

  toggleItems(serviceIndex, searchName) {
    if (this.component.name === 'UtterancesComponent' || this.component.name === 'ReportsComponent') {
      for (let i = 0; i < this.dataSource[serviceIndex].skills.length; i++) {
        if (this.dataSource[serviceIndex].skills[i].name === searchName) {
          if (this.dataSource[serviceIndex].skills[i].checked) {
            this.counter--;
          } else {
            this.counter++;
          }
          this.dataSource[serviceIndex].skills[i].checked = !this.dataSource[serviceIndex].skills[i].checked;
          this.inputData = true;
          break;
        }
      }
    }
  }

  changeDropdown(toggle: any = false) {
    this.dataExpanded = toggle;
    if (!toggle && this.inputData) this.customCallback({});
  }

  refreshOnChange(value: any) {
    this.inputData = value;
    this.inputDataChange.emit(this.inputData);
    // FIX ME: this router approach should be removed in future
    if (this.component.name !== 'UtterancesComponent') {
      this.router.navigate([this.component.path], { queryParams: { page: this.selectedPage } });
    }
  }
}
