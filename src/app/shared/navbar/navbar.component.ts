import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CommandNavigatorService} from '../../services/command-navigator.service';
import {LoadingService} from '../../services/loading.service';
import {delay} from 'rxjs/operators';
import {HttpErrorResponceService} from '../../services/http-error-responce.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private sidebarVisibleForDesktop: boolean;
  private loading = false;
  public isCollapsed = true;
  @ViewChild('navbar-cmp', {static: false}) button;
  @ViewChild('pageDiv') pageDiv: ElementRef;

  constructor(location: Location,
              private renderer: Renderer2,
              private element: ElementRef,
              private router: Router,
              private navigatorService: CommandNavigatorService,
              private loadingService: LoadingService,
              private httpErrorResponceService: HttpErrorResponceService,
              private notificationService: NotificationService,
              private appRef: ApplicationRef,
              private activatedRoute: ActivatedRoute
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.sidebarVisibleForDesktop = true;

    navigatorService.popupPageEmmiter.subscribe(componentRefOnNavigation => {
      this.renderPage(componentRefOnNavigation);
      componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
        document.getElementById('buttonClose').click();
      });
    });

  }

  public renderPage(componentRef: ComponentRef<any>) {
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    const childElements = this.pageDiv.nativeElement.childNodes;
    for (const childElement of childElements) {
      this.renderer.removeChild(this.pageDiv.nativeElement, childElement);
    }
    this.renderer.appendChild(this.pageDiv.nativeElement, domElem);
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });

    /* Auto minimize sidebar if parameter says so*/
    this.activatedRoute.queryParams.subscribe(params => {

      if (params['sidebar-status'] === 'minimized') {
        this.updateToggle();
      }
    });

    this.listenToLoading();
    this.listenToHttpErrors();
  }

  // ngAfterViewInit(): void {
  //   /* Auto minimize sidebar if parameter says so*/
  //   this.activatedRoute.queryParams.subscribe(params => {
  //
  //     if (params['sidebar-status'] === 'minimized') {
  //       this.collapse();
  //     }
  //   });
  // }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  listenToHttpErrors(): void {
    this.httpErrorResponceService.httpErrorMessageEmitter
      .subscribe((message) => {
        if (message !== '') {
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', message);
        }
      });
  }

  mapPagesToHeaders() {
    const headers = [];
    for (const page of this.navigatorService.pages) {
      const params: Map<string, string> = page.instance.params;
      const key = 'HIDE-HEADER';

      if (params.has(key)) {
        if (params.get('HIDE-HEADER') === 'TRUE') {
          continue;
        }
      }

      headers.push(
        {
          pageId: page.instance.pageId,
          title: page.instance.getTitle()
        });
    }
    return headers;
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].getTitle();
      }
    }
    return 'Dashboard';
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];

    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };

  collapse() {

    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }

  updateToggle() {
    if (this.sidebarVisibleForDesktop === true) {
      this.renderer.addClass(document.body, 'sidebar-mini');
      this.sidebarVisibleForDesktop = false;
    } else {
      this.renderer.removeClass(document.body, 'sidebar-mini');
      this.sidebarVisibleForDesktop = true;
    }
  }

  navigateToDashboard() {
    this.navigatorService.navigate('STATICPAGE[NAME:dashboard,TITLE:Dashboard]');
  }

  closePageById(id: string) {
    this.navigatorService.closeById(id);
  }

  isTheActiveId(pageId: any) {
    if (pageId.toUpperCase() === this.navigatorService.currentId.toUpperCase()) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

}
