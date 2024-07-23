/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { OnInit, Component, Input, Output, ViewChild, ViewContainerRef, TemplateRef, EventEmitter } from "@angular/core";

@Component({
  selector: 'aiap-wbc-validation-engagements-actions-tab-v1',
  templateUrl: './validation-engagements-actions-tab-v1.html',
  styleUrls: ['./validation-engagements-actions-tab-v1.scss'],
})
export class ValidationEngagementsActionsTabV1 implements OnInit {

  static getClassName() {
    return 'ValidationEngagementsActionsTabV1';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild("actionsMonacoEditor", { read: TemplateRef }) schemaEditor: TemplateRef<any>;
  @ViewChild("actionMonacoEditorContainer", { read: ViewContainerRef }) monacoContainer: ViewContainerRef;

  state = {
    monacoOptions: {
      theme: 'hc-black',
      language: 'json',
      automaticLayout: true,
      padding: {
        bottom: 20
      },
      scrollbar: {
        vertical: 'hidden'
      },
    }
  };

  constructor() { }

  ngOnInit() { };

  isValid() {
    const RET_VAL = true;
    return RET_VAL;
  }

  clearMonacoContainer() {
    this.monacoContainer.clear();
  }

  createMonacoEditor() {
    this.monacoContainer.createEmbeddedView(this.schemaEditor);
  }
}
