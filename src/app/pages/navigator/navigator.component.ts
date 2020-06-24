import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  OnChanges,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {NavigatorService} from '../../services/navigator.service';
import {InternalMessageService} from '../../shared/utils/internal-message-service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit, AfterViewInit {


  @ViewChild('pageDiv') pageDiv: ElementRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private renderer: Renderer2,
              private internalMessageService: InternalMessageService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigatorService: NavigatorService) {
  }

  ngOnInit(): void {
  }



  // ngOnChanges() {
  //
  // }

  ngAfterViewInit(): void {
    this.refreshDirectionComponent();
    this.subscripeRootChange();
  }

  refreshDirectionComponent() {

    let pageId = '';
    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      pageId = this.activatedRoute.snapshot.paramMap.get('id');
    }

    let pageRendered = false;
    for (const page of this.navigatorService.pages) {


      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
        this.renderPage(page);
        pageRendered = true;
      }
    }

    if (!pageRendered && this.navigatorService.pages.length > 0) {
      this.renderPage(this.navigatorService.pages[0]);
    }

  }


  subscripeRootChange() {

    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.refreshDirectionComponent();
          // let updatedUuid = '';
          // if (this.activatedRoute.snapshot.paramMap.has('id')) {
          //   updatedUuid = this.activatedRoute.snapshot.paramMap.get('id');
          // }
          // for (const page of this.navigatorService.pages) {
          //   if (updatedUuid === page.instance.uuid) {
          //     this.renderPage(page);
          //   }
          // }
        }

      }
    );
  }


  public renderPage(page: ComponentRef<any>) {

    this.appRef.attachView(page.hostView);

    const domElem = (page.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    console.log(this.pageDiv);
    const childElements = this.pageDiv.nativeElement.childNodes;
    for (const childElement of childElements) {
      this.renderer.removeChild(this.pageDiv.nativeElement, childElement);
    }

    this.renderer.appendChild(this.pageDiv.nativeElement, domElem);

    // page.instance.tabNavigationEmitter.subscribe(event => {
    //   // this.pageNavigatorService.openLocation(event);
    // })
  }


}
