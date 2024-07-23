import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { EventBusServiceV1 } from "client-services";
import { EVENT_TYPE, IEvent } from "client-utils";

@Component({
  selector: 'aiap-modal',
  templateUrl: './modal.layout.html',
  styleUrls: ['./modal.layout.scss']
})
export class ModalLayout implements OnInit {
  
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;

  constructor(
    private eventBusService: EventBusServiceV1,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this.eventBusService.subscribe?.((value: IEvent) => {
      switch (value.type) {
        case EVENT_TYPE.OPEN_MODAL: this.handleModalOpen(value.data); break;
        case EVENT_TYPE.CLOSE_MODAL: this.handleModalClose(value.data); break;
      }
    });
  }
  
  
    handleModalOpen(data: any) {
      this.container?.clear();
      this.container?.createEmbeddedView(data.template);
      // this.classes.modal["aiap-modal-hide"] = false;
      this.changeDetectorRef.detectChanges()
    }
  
    handleModalClose(data: any) {
      this.container?.clear();
      // this.classes.modal["aiap-modal-hide"] = true;
    }
  

  ngAfterViewInit(): void { }


  toggle() {

  }
}
