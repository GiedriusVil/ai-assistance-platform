import { Component, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { EventBusServiceV1 } from "client-services";
import { EVENT_TYPE, IEvent } from "client-utils";
import { SessionServiceV2 } from "../../services";

@Component({
  selector: 'aiap-side-nav',
  templateUrl: './side-nav.layout.html',
  styleUrls: ['./side-nav.layout.scss']
})
export class SideNavLayout {


  data: any;
  url: any;
  params: any;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;
  @ViewChild('wbcTemplate', {read: TemplateRef}) wbcTemplate: TemplateRef<any> | undefined;
  
  constructor(
    private eventBus: EventBusServiceV1,
    private sessionService: SessionServiceV2,
  ) { }

  ngOnInit(): void {
    this.eventBus.subscribe?.(this.onEventBus.bind(this));

    const LAYOUT_ELEMENT = this.sessionService.getSession().engagement.chatApp.layout.sideNav;
    this.url = LAYOUT_ELEMENT.url;
    this.data = LAYOUT_ELEMENT.component;
    this.params = LAYOUT_ELEMENT.params;
  }

  ngAfterViewInit(): void {
    // this.swapWbcView();
  }

  onEventBus(value: IEvent) {
    switch (value.type) {
      case EVENT_TYPE.CHANGE_SIDE_NAV_WBC: this.handleBaseWbcEvent(value.data); break;
    }
  }

  // TODO: ANBE
  handleBaseWbcEvent(data: any) {
    this.data = data.component;
    this.url = `http://localhost:3005/client-wbc/${this.data}/main.js`;
    this.swapWbcView();
  }

  swapWbcView() {    if (!this.wbcTemplate) {
      return;
    }

    this.container?.clear();
    this.container?.createEmbeddedView(this.wbcTemplate);
  }
}
