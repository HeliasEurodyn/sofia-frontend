import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {AdminLayoutRoutes} from '../../../layouts/admin-layout/admin-layout.routing';
import {InternalMessageService} from '../../utils/internal-message-service';
import {NavigatorService} from '../../../services/navigator.service';

@Component({
  selector: 'app-container-child',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit, AfterViewInit {

  @ViewChild('pageDiv') pageDiv: ElementRef;
  pages: ComponentRef<any>[] = [];
  public tabId: string;
  private command: string;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private renderer: Renderer2,
              private internalMessageService: InternalMessageService,
              private pageNavigatorService: NavigatorService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //  this.openPage(this.command);
  }

  public openPageAfterOpen(command: string) {
  }

  // public openPageAfterOpen(command: string) {
  //   this.command = command;
  // }
  //
  // public openPage(command: string) {
  //
  //
  //   const componentRef = this.pageNavigatorService.openLocation(command);
  //
  //   this.appRef.attachView(componentRef.hostView);
  //
  //   const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  //   console.log(this.pageDiv);
  //   const childElements = this.pageDiv.nativeElement.childNodes;
  //   for (const childElement of childElements) {
  //     this.renderer.removeChild(this.pageDiv.nativeElement, childElement);
  //   }
  //
  //   this.renderer.appendChild(this.pageDiv.nativeElement, domElem);
  //
  //
  //   this.pages.push(componentRef);
  //
  //   componentRef.instance.tabNavigationEmitter.subscribe(event => {
  //     // this.pageNavigatorService.openLocation(event);
  //
  //   })
  // }

}
