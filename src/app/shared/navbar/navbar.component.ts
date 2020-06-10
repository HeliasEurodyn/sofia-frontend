import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ROUTES} from '../../sidebar/sidebar.component';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {InternalMessageService} from '../utils/internal-message-service';

@Component({
  moduleId: module.id,
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private sidebarVisibleForDesktop: boolean;
  private pageHeaders: Map<string, string> = new Map();
  private pageIdsList: string[] = [];

  public isCollapsed = true;
  @ViewChild('navbar-cmp', {static: false}) button;

  constructor(location: Location,
              private renderer: Renderer2,
              private element: ElementRef,
              private router: Router,
              private internalMessageService: InternalMessageService) {
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
    this.subscribeToInternalMessages();

  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (var item = 0; item < this.listTitles.length; item++) {
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


  private subscribeToInternalMessages() {
    this.internalMessageService
      .accessMessage('OpenPageHeaderEvent')
      .subscribe(pageHeaderData => {
        this.pageHeaders.set(pageHeaderData.pageId, pageHeaderData.title);
        this.pageIdsList.push(pageHeaderData.pageId);
      });
    //
    // this.internalMessageService
    //   .accessMessage('ClosePageHeaderEvent')
    //   .subscribe(pageId => {
    //     if (this.pageHeaders.has(pageId)) {
    //       this.pageHeaders.delete(pageId);
    //     }
    //   });

  }

  selectPage(key: string) {
    this.internalMessageService.publishMessage('selectPageEvent', key);
  }

  closePage(key: string) {

    if (this.pageHeaders.has(key)) {
      this.pageHeaders.delete(key);
    }

    this.pageIdsList = this.pageIdsList.filter(item => item !== key);

    this.internalMessageService.publishMessage('closePageEvent', key);
    if (this.pageIdsList.length > 0) {
      this.internalMessageService.publishMessage('selectPageEvent', this.pageIdsList[this.pageIdsList.length - 1]);
    } else {
      this.internalMessageService.publishMessage('selectPageEvent', 'dashboard');
    }


  }

  ngOnDestroy(): void {
    this.internalMessageService.unsubscribeTopic('OpenPageHeaderEvent');
    // this.internalMessageService.unsubscribeTopic('ClosePageHeaderEvent');
  }

}
