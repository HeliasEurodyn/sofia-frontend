import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {InternalMessageService} from '../../utils/internal-message-service';
import {AdminLayoutRoutes} from '../../../layouts/admin-layout/admin-layout.routing';
import * as uuid from 'uuid';
import {TabComponent} from '../tab/tab.component';

@Component({
  selector: 'app-main-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.css']
})
export class TabContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabDiv') tabDiv: ElementRef;
  // activeComponents: Map<string, ComponentRef<any>> = new Map();
  tabsList: ComponentRef<TabComponent>[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private renderer: Renderer2,
              private internalMessageService: InternalMessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  //  this.openTabWithId('dashboard', 'STATICPAGE[NAME:dashboard]');
    this.subscribeToInternalMessages();

  }

  private subscribeToInternalMessages() {
    // this.internalMessageService
    //   .accessMessage('openTabEvent')
    //   .subscribe(data => {
    //     const pageId = this.openTab(data.path);
    //     this.internalMessageService.publishMessage('OpenTabHeaderEvent', {pageId: pageId, title: data.title});
    //   });
    //
    // this.internalMessageService
    //   .accessMessage('selectTabEvent')
    //   .subscribe(pageId => {
    //     this.selectPage(pageId);
    //   });
    //
    // this.internalMessageService
    //   .accessMessage('closeTabEvent')
    //   .subscribe(pageId => {
    //     this.closeTab(pageId);
    //   });

  }

  ngOnDestroy(): void {
    // this.internalMessageService.unsubscribeTopic('openTabEvent');
    // this.internalMessageService.unsubscribeTopic('closeTabEvent');
  }


  selectPage(pageId: string) {
    // if (!this.activeComponents.has(pageId)) {
    //   return;
    // }
    //
    // const componentRef = this.activeComponents.get(pageId);
    // this.appRef.attachView(componentRef.hostView);
    //
    // const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    //
    // const childElements = this.tabDiv.nativeElement.childNodes;
    // for (const childElement of childElements) {
    //   this.renderer.removeChild(this.tabDiv.nativeElement, childElement);
    // }
    //
    // this.renderer.appendChild(this.tabDiv.nativeElement, domElem);
    //
    // console.log('Select ' + pageId);
    // console.log(this.tabsList);
  }

  closeTab(pageId: string) {

    // if (!this.activeComponents.has(pageId)) {
    //   return;
    // }
    //
    // const componentRef = this.activeComponents.get(pageId);
    // this.appRef.detachView(componentRef.hostView);
    // componentRef.destroy();
    //
    // this.activeComponents.delete(pageId);
    // this.tabsList = this.tabsList.filter(item => item !== pageId);
    //
    // console.log('Close ' + pageId);
    // console.log(this.tabsList);

  }

  private openTab(path: string) {
    // const pageId = uuid.v4();
    // this.openTabWithId(pageId, path);
    // return pageId;
  }

  private openTabWithId(pageId: string, path: string) {
//
//     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabComponent);
//     const componentRef = componentFactory.create(this.injector);
//
//
//     this.appRef.attachView(componentRef.hostView);
//
//     const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
//
//     const childElements = this.tabDiv.nativeElement.childNodes;
//     for (const childElement of childElements) {
//       this.renderer.removeChild(this.tabDiv.nativeElement, childElement);
//     }
//
//     this.renderer.appendChild(this.tabDiv.nativeElement, domElem);
//
//   //  this.activeComponents.set(pageId, componentRef);
//     this.tabsList.push(componentRef);
// //    componentRef.instance.tabId = pageId;
//  //   componentRef.instance.openPageAfterOpen(path);
  }


}
