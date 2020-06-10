import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef, EmbeddedViewRef,
  Injector, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {InternalMessageService} from '../../utils/internal-message-service';
import {AdminLayoutRoutes} from '../../../layouts/admin-layout/admin-layout.routing';
import * as uuid from 'uuid';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainDiv') mainDiv: ElementRef;
  activeComponents: Map<string, ComponentRef<any>> = new Map();
  activeComponentsList: string[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private renderer: Renderer2,
              private internalMessageService: InternalMessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.openPageWithPageId('dashboard', 'dashboard');

    this.subscribeToInternalMessages();
  }

  private subscribeToInternalMessages() {
    this.internalMessageService
      .accessMessage('OpenPageEvent')
      .subscribe(pageData => {
        const pageId = this.openPage(pageData.path);
        this.internalMessageService.publishMessage('OpenPageHeaderEvent', {pageId: pageId, title: pageData.title});
      });

    this.internalMessageService
      .accessMessage('selectPageEvent')
      .subscribe(pageId => {
        this.selectPage(pageId);
      });

    this.internalMessageService
      .accessMessage('closePageEvent')
      .subscribe(pageId => {
        this.closePage(pageId);
      });

  }

  ngOnDestroy(): void {
    this.internalMessageService.unsubscribeTopic('OpenPageEvent');
    this.internalMessageService.unsubscribeTopic('closePageEvent');
  }


  selectPage(pageId: string) {
    if (!this.activeComponents.has(pageId)) {
      return;
    }

    const componentRef = this.activeComponents.get(pageId);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    const childElements = this.mainDiv.nativeElement.childNodes;
    for (const childElement of childElements) {
      this.renderer.removeChild(this.mainDiv.nativeElement, childElement);
    }

    this.renderer.appendChild(this.mainDiv.nativeElement, domElem);

    console.log('Select ' + pageId);
    console.log(this.activeComponentsList);
  }

  closePage(pageId: string) {

    if (!this.activeComponents.has(pageId)) {
      return;
    }

    const componentRef = this.activeComponents.get(pageId);
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();

    this.activeComponents.delete(pageId);
    this.activeComponentsList = this.activeComponentsList.filter(item => item !== pageId);

    console.log('Close ' + pageId);
    console.log(this.activeComponentsList);

  }

  private openPage(path: string) {
    const pageId = uuid.v4();
    this.openPageWithPageId(pageId, path);
    return pageId;
  }

  private openPageWithPageId(pageId: string, path: string) {

    const selectedRoutes = AdminLayoutRoutes.filter(
      route => route.path === path);

    if (selectedRoutes.length === 0) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(selectedRoutes[0].component);
    const componentRef = componentFactory.create(this.injector);


    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    const childElements = this.mainDiv.nativeElement.childNodes;
    for (const childElement of childElements) {
      this.renderer.removeChild(this.mainDiv.nativeElement, childElement);
    }

    this.renderer.appendChild(this.mainDiv.nativeElement, domElem);

    this.activeComponents.set(pageId, componentRef);
    this.activeComponentsList.push(pageId);
    componentRef.instance.pageId = pageId;
    console.log('Open ');
    console.log(this.activeComponentsList);
  }


}
