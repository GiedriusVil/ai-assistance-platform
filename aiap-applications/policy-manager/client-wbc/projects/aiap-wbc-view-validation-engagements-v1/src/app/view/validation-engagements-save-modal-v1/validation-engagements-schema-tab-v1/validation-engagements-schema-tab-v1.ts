/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { OnInit, Component, Input, ViewChild, ViewContainerRef, TemplateRef } from "@angular/core";

@Component({
  selector: 'aiap-wbc-validation-engagements-schema-tab-v1',
  templateUrl: './validation-engagements-schema-tab-v1.html',
  styleUrls: ['./validation-engagements-schema-tab-v1.scss'],
})
export class ValidationEngagementsSchemasTabV1 implements OnInit {

  static getClassName() {
    return 'ValidationEngagementsSchemasTabV1';
  }

  @Input() schema: any = { value: '' };

  @ViewChild("schemaEditor", { read: TemplateRef }) schemaEditor: TemplateRef<any>;
  @ViewChild("monacoContainer", { read: ViewContainerRef }) monacoContainer: ViewContainerRef;

  state = {
    monacoOptions: {
      theme: 'hc-black',
      language: 'javascript',
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
