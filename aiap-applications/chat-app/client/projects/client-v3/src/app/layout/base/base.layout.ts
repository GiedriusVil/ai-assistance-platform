import { AfterViewChecked, AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { EventBusServiceV1 } from "client-services";
import { EVENT_TYPE, IEvent } from "client-utils";
import { SessionServiceV2 } from "../../services";

@Component({
  selector: 'aiap-base',
  templateUrl: './base.layout.html',
  styleUrls: ['./base.layout.scss']
})
export class BaseLayout implements OnInit {


  data: any;
  url: any;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;
  @ViewChild('wbcTemplate', {read: TemplateRef}) wbcTemplate: TemplateRef<any> | undefined;
  
  constructor(
    private eventBus: EventBusServiceV1,
    private sessionService: SessionServiceV2,
  ) { }

  ngOnInit(): void {
    this.eventBus.subscribe?.(this.onEventBus.bind(this));

    const LAYOUT_ELEMENT = this.sessionService.getSession().engagement.chatApp.layout.base;
    this.url = LAYOUT_ELEMENT.url;
    this.data = LAYOUT_ELEMENT.component;
  }

  ngAfterViewInit(): void { }

  onEventBus(value: IEvent) {
    switch (value.type) {
      case EVENT_TYPE.CHANGE_BASE_WBC: this.handleBaseWbcEvent(value.data); break;
    }
  }

  handleBaseWbcEvent(data: any) {
    this.data = data.text;
    this.url = `http://localhost:3005/client-wbc/${this.data}/main.js`;
    this.swapWbcView();
  }

  swapWbcView() {
    if (!this.wbcTemplate) {
      return;
    }

    this.container?.clear();
    this.container?.createEmbeddedView(this.wbcTemplate);
  }
}
