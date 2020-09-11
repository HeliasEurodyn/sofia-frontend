import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {NavigatorService} from '../../services/navigator.service';
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
  // private pageHeaders: Map<string, string> = new Map();
  // private pageIdsList: string[] = [];

  public isCollapsed = true;
  @ViewChild('navbar-cmp', {static: false}) button;

  constructor(location: Location,
              private renderer: Renderer2,
              private element: ElementRef,
              private router: Router,
              private navigatorService: NavigatorService,
              private loadingService: LoadingService,
              private httpErrorResponceService: HttpErrorResponceService,
              private notificationService: NotificationService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.sidebarVisibleForDesktop = true;
  }


  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
    this.listenToLoading();
    this.listenToHttpErrors();
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
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
          title: page.instance.title
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
        return this.listTitles[item].title;
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


  // private subscribeToInternalMessages() {
  //   this.internalMessageService
  //     .accessMessage('OpenTabHeaderEvent')
  //     .subscribe(pageHeaderData => {
  //       this.pageHeaders.set(pageHeaderData.pageId, pageHeaderData.title);
  //       this.pageIdsList.push(pageHeaderData.pageId);
  //     });
  //   //
  //   // this.internalMessageService
  //   //   .accessMessage('ClosePageHeaderEvent')
  //   //   .subscribe(pageId => {
  //   //     if (this.pageHeaders.has(pageId)) {
  //   //       this.pageHeaders.delete(pageId);
  //   //     }
  //   //   });
  //
  // }

  navigateById(id: string) {
    this.navigatorService.navigateById(id);
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
}
