import {ApplicationRef, ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector} from '@angular/core';
import * as uuid from 'uuid';
import {Router, Routes} from '@angular/router';
import {CommandParserService} from './command-parser.service';


@Injectable({
  providedIn: 'root'
})
export class CommandNavigatorService {

  public static NavPages: Routes = [];
  public currentId: string;
  public pages: any[] = [];
  public popupPageEmmiter: EventEmitter<ComponentRef<any>> = new EventEmitter();
  public componentRefOnNavigation: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private router: Router,
              private commandParserService: CommandParserService
  ) {
    // this.navigate('STATICPAGE[NAME:dashboard,TITLE:dashboard,HIDE-HEADER:TRUE]');
  }

  public navigate(command: string) {

    if (this.componentRefOnNavigation != null) {
      command = this.commandParserService.mapToCommand(command, '$PAGEID', this.componentRefOnNavigation.instance.pageId);
    }

    const commandParametersKeyValMap: Map<string, string> = this.commandParserService.parse(command);
    const commandType = commandParametersKeyValMap.get('COMMAND-TYPE');
    console.log(commandParametersKeyValMap);
    switch (commandType) {
      case 'POPUPLIST': {
        this.componentRefOnNavigation = this.generateComponent(commandParametersKeyValMap);
        this.navigatoToPopupComponentRef(this.componentRefOnNavigation);
        break;
      }
      case 'LIST':
      case 'FORM':
      case 'STATICPAGE': {
        let name = '';

        if (commandType === 'LIST') {
          name = 'list';
        } else if (commandType === 'FORM') {
          name = 'form';
        } else {
          name = commandParametersKeyValMap.get('NAME');
        }


        //  const obj = [...commandParametersKeyValMap].reduce((o, [key, value]) => (o[key] = value, o), {});
        const base64Command = btoa(command);

        const urlParamsMap: Map<string, string> = new Map();
        urlParamsMap.set('nav', base64Command);
        if (commandParametersKeyValMap.has('SIDEBAR-STATUS')) {
          urlParamsMap.set('sidebar-status', commandParametersKeyValMap.get('SIDEBAR-STATUS'))
        }

        let tab = '';
        if (commandParametersKeyValMap.has('TAB')) {
          tab = commandParametersKeyValMap.get('TAB');
        }

        const urlParams = [...urlParamsMap].reduce((o, [key, value]) => (o[key] = value, o), {});

        if (tab === 'new') {
          const url = this.router.serializeUrl(this.router.createUrlTree(['/' + name], {queryParams: urlParams}));
          window.open(url, '_blank');
        } else {
          this.router.navigate(['/' + name], {queryParams: urlParams});
        }

        break;
      }
    }

    return this.componentRefOnNavigation;
  }

  // private navigatoToBaseComponentRef(componentRef: ComponentRef<any>) {
  //   if (componentRef !== null) {
  //
  //     // Check if there is Parent-pageId reference to the command
  //     if (componentRef.instance.params.has('PARENT-PAGEID')) {
  //
  //       const parentPageId = componentRef.instance.params.get('PARENT-PAGEID');
  //       // Iterate pages and try to find the referring page.
  //       for (const page of this.pages) {
  //         // If page is found do
  //         if (parentPageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
  //           // If page has already next page - destroy it from memory
  //           if (page.instance.nextPage !== null && page.instance.nextPage !== undefined) {
  //             this.destroyNextPageBranch(page.instance.nextPage);
  //           }
  //
  //           // Make new page as next
  //           page.instance.nextPage = componentRef;
  //
  //           // Make new pages prefious the found page
  //           componentRef.instance.previousPage = page;
  //           this.pages[this.pages.indexOf(page)] = componentRef;
  //
  //         }
  //       }
  //     } else {
  //       this.pages.push(componentRef);
  //     }
  //
  //     this.router.navigateByUrl('/main/' + componentRef.instance.pageId);
  //   }
  // }

  private navigatoToPopupComponentRef(componentRef: ComponentRef<any>) {
    if (componentRef !== null) {
      this.popupPageEmmiter.emit(componentRef);
    }
  }

  public navigateToPreviousPage(pageId) {
    for (const page of this.pages) {
      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
        if (page.instance.previousPage === null) {
          return;
        }

        if (page.instance.previousPage.instance.onFocusIn != null) {
          page.instance.previousPage.instance.onFocusIn();
        }

        const pageIndex = this.pages.indexOf(page)
        this.pages[pageIndex] = page.instance.previousPage;
        this.componentRefOnNavigation = page.instance.previousPage;
        this.router.navigateByUrl('/main/' + page.instance.previousPage.instance.pageId);
        return;
      }
    }
  }

  public navigateToNextPage(pageId) {
    for (const page of this.pages) {
      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
        if (page.instance.nextPage === null) {
          return;
        }

        if (page.instance.nextPage.instance.onFocusIn != null) {
          page.instance.nextPage.instance.onFocusIn();
        }

        this.pages[this.pages.indexOf(page)] = page.instance.nextPage;
        this.componentRefOnNavigation = page.instance.nextPage;
        this.router.navigateByUrl('/main/' + page.instance.nextPage.instance.pageId);
      }
    }
  }

  public navigateById(pageId: string) {
    for (const page of this.pages) {
      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {

        if (page.instance.onFocusIn != null) {
          page.instance.onFocusIn();
        }

        this.router.navigateByUrl('/main/' + page.instance.pageId);
      }
    }
  }

  public closeAndBack(pageId) {
    for (const page of this.pages) {
      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
        if (page.instance.previousPage === null) {
          this.closeById(pageId);
        }

        if (page.instance.previousPage.instance.onFocusIn != null) {
          page.instance.previousPage.instance.onFocusIn();
        }

        const pageIndex = this.pages.indexOf(page)
        this.pages[pageIndex] = page.instance.previousPage;
        this.componentRefOnNavigation = page.instance.previousPage;
        this.router.navigateByUrl('/main/' + page.instance.previousPage.instance.pageId);

        return;
      }
    }
  }

  public closeById(id: string) {
    for (const page of this.pages) {
      if (id.toUpperCase() === page.instance.pageId.toUpperCase()) {
        const pageIndex = this.pages.indexOf(page);

        if (page.instance.nextPage !== null && page.instance.nextPage !== undefined) {
          this.destroyNextPageBranch(page.instance.nextPage);
        }

        if (page.instance.previousPage !== null && page.instance.previousPage !== undefined) {
          this.destroyPreviousPageBranch(page.instance.previousPage);
        }

        this.appRef.detachView(page.hostView);
        page.destroy();

        this.pages.splice(pageIndex, 1);
      }
    }

    if (this.pages.length > 0 && id.toUpperCase() === this.currentId.toUpperCase()) {

      if (this.pages[this.pages.length - 1].instance.onFocusIn != null) {
        this.pages[this.pages.length - 1].instance.onFocusIn();
      }

      // this.componentRefOnNavigation = this.pages[this.pages.length - 1].instance;
      this.router.navigateByUrl('/main/' + this.pages[this.pages.length - 1].instance.pageId);
    }
  }

  private destroyNextPageBranch(page: ComponentRef<any>) {
    if (page.instance.nextPage !== null && page.instance.nextPage !== undefined) {
      this.destroyNextPageBranch(page.instance.nextPage);
    }
    this.appRef.detachView(page.hostView);
    page.destroy();
  }

  private destroyPreviousPageBranch(page: ComponentRef<any>) {
    if (page.instance.previousPage !== null && page.instance.previousPage !== undefined) {
      this.destroyNextPageBranch(page.instance.previousPage);
    }
    this.appRef.detachView(page.hostView);
    page.destroy();
  }

  public generateComponent(pageParameters: Map<string, string>) {
    if (!pageParameters.has('COMMAND-TYPE')) {
      return null;
    }

    const commandType = pageParameters.get('COMMAND-TYPE');
    let navPageName = '';
    switch (commandType) {
      case 'POPUPLIST': {
        navPageName = 'LIST';
        break;
      }
      case 'LIST': {
        navPageName = 'LIST';
        break;
      }
      case 'FORM': {
        navPageName = 'FORM';
        break;
      }
      case 'STATICPAGE': {
        navPageName = pageParameters.get('NAME');
        break;
      }
    }

    const navPage = CommandNavigatorService.NavPages.filter(route => route.path.toUpperCase() === navPageName.toUpperCase());

    if (navPage.length === 0) {
      return null;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(navPage[0].component);
    const componentRef: ComponentRef<any> = componentFactory.create(this.injector);
    componentRef.instance.params = pageParameters;
    componentRef.instance.pageId = uuid.v4();

    return componentRef;
  }

}
