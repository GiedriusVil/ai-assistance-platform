import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

import { LocalStorageServiceV1 } from 'client-services';
import { _debugX } from 'client-utils';

@Component({
  selector: 'aiap-header-zoom',
  templateUrl: './header-zoom.html',
  styleUrls: ['./header-zoom.scss'],
})
export class HeaderZoom implements OnInit {
  static getClassName() {
    return 'HeaderZoom';
  }

  @Input() zoomInIcon: string;
  @Input() zoomOutIcon: string;
  @Input() resetZoomIcon: string;
  @Input() isFullscreen: boolean;
  @Output() zoomEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  selectedZoom = 100;

  @ViewChild('zoomBox') zoomBox: ElementRef<HTMLElement>;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private localStorageService: LocalStorageServiceV1
  ) {}

  @HostListener('window:click', ['$event']) onClick(event: any) {
    const ZOOM_ELEMENT = document.querySelector('.header--zoom');
    const ELEMENT = document.querySelector('.header--zoom--box');
    if (!this.zoomBox.nativeElement.contains(event?.target) && !ZOOM_ELEMENT?.contains(event?.target) && ELEMENT.classList.contains('open')) {
      ELEMENT.classList.remove('open');
    }
  }

  ngOnInit(): void {
    this.selectedZoom = this.localStorageService.getChatAppStateParameter('zoom') || 100;
  }

  toggleZoom() {
    const ELEMENT = this.elementRef.nativeElement.querySelector('.header--zoom--box');
    ELEMENT.classList.contains('open') ? ELEMENT.classList.remove('open') : ELEMENT.classList.add('open');
  }

  handleZoom(val: boolean) {
    if (val && this.selectedZoom < 200) {
      this.selectedZoom = this.selectedZoom + 25;
    }
    if (!val && this.selectedZoom > 50) {
      this.selectedZoom = this.selectedZoom - 25;
    }
    this.localStorageService.setChatAppStateParameter('zoom', this.selectedZoom);
    this.zoomEventEmitter.emit();

    _debugX(HeaderZoom.getClassName(), 'handleZoom', { newZoom: this.selectedZoom });
  }

  resetZoom() {
    this.selectedZoom = 100;
    this.localStorageService.setChatAppStateParameter('zoom', this.selectedZoom);
    this.zoomEventEmitter.emit();
  }
}
