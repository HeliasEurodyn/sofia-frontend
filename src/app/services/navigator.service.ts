import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector} from '@angular/core';
import * as uuid from 'uuid';
import {Router, Routes} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  public static NavPages: Routes = [];
  public pages: any[] = [];

  public currentId: string;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private router: Router,
  ) {
    this.createDefaultPage('dashboard');
  }

  createDefaultPage(pageName: string) {
    const params: Map<string, string> = new Map();
    params.set('NAME', pageName);
    params.set('HIDE-HEADER', 'TRUE');
    const componentRef: ComponentRef<any> = this.generateStaticPage(params);
    console.log(componentRef);
    if (componentRef !== null) {
      this.pages.push(componentRef);
      componentRef.instance.pageId = 'default';
      componentRef.instance.params = params;
      if (params.get('TITLE')) {
        componentRef.instance.title = params.get('TITLE');
      }
      //  this.currentId = 'default';
    }
    return;
  }

  public navigateToPreviousPage(pageId) {

    for (const page of this.pages) {
      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
        if (page.instance.previousPage === null) {
          return;
        }

        const pageIndex = this.pages.indexOf(page)
        this.pages[pageIndex] = page.instance.previousPage;
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
        this.pages[this.pages.indexOf(page)] = page.instance.nextPage;
        this.router.navigateByUrl('/main/' + page.instance.nextPage.instance.pageId);
      }
    }
  }


  public navigateById(pageId: string) {
    for (const page of this.pages) {
      if (pageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
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

        const pageIndex = this.pages.indexOf(page)
        this.pages[pageIndex] = page.instance.previousPage;
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
      this.router.navigateByUrl('/main/' + this.pages[this.pages.length - 1].instance.pageId);
    }

  }

  public openLocation(command: string) {
    command = command.toUpperCase();

    if (command.length === 0) {
      return;
    }

    const commandType = command.replace(/\[.*/, '');

    if (this.verifyBrackets(command) === false) {
      return null;
    }

    const index = command.indexOf('[');

    if (index <= 0) {
      return;
    }


    let commandInsideBrackets = command.replace(/.*\[|\].*/, '');
    commandInsideBrackets = commandInsideBrackets.replace(/.*\[|\].*/, '');
    if (commandInsideBrackets.length === 0) {
      return;
    }

    const commandParameters = commandInsideBrackets.split(',');
    const commandParametersKeyValMap: Map<string, string> = new Map();

    for (const commandParameter of commandParameters) {
      const commandParameterKeyVal: string[] = commandParameter.split(':');
      commandParametersKeyValMap.set(commandParameterKeyVal[0], commandParameterKeyVal[1]);
    }

    if (commandType === 'STATICPAGE') {
      const componentRef: ComponentRef<any> = this.generateStaticPage(commandParametersKeyValMap);
      if (componentRef !== null) {
        const pageId = uuid.v4();
        componentRef.instance.pageId = pageId;
        componentRef.instance.params = commandParametersKeyValMap;
        if (commandParametersKeyValMap.get('TITLE')) {
          componentRef.instance.title = commandParametersKeyValMap.get('TITLE');
        }
        if (componentRef.instance.params.has('PARENT-PAGEID')) {

          const parentPageId = componentRef.instance.params.get('PARENT-PAGEID');
          for (const page of this.pages) {
            if (parentPageId.toUpperCase() === page.instance.pageId.toUpperCase()) {
              if (page.instance.nextPage !== null && page.instance.nextPage !== undefined) {
                this.destroyNextPageBranch(page.instance.nextPage);
              }
              page.instance.nextPage = componentRef;
              componentRef.instance.previousPage = page;
              this.pages[this.pages.indexOf(page)] = componentRef;

              // this.router.navigateByUrl('/main/' + page.instance.pageId);
            }
          }
        } else {
          this.pages.push(componentRef);
        }

        this.router.navigateByUrl('/main/' + componentRef.instance.pageId);

      }
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

  private verifyBrackets(command: string) {

    const bracketOpenLength = (command.match(/\[/) || []).length;
    const bracketCloseLength = (command.match(/\]/) || []).length;

    if (bracketOpenLength !== 1 || bracketCloseLength !== 1) {
      return false;
    } else {
      return true;
    }
  }


  public generateStaticPage(pageParameters: Map<string, string>) {

    if (!pageParameters.has('NAME')) {
      return null;
    }

    const navPage = NavigatorService.NavPages.filter(route => route.path.toUpperCase() === pageParameters.get('NAME').toUpperCase());

    if (navPage.length === 0) {
      return null;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(navPage[0].component);
    const componentRef: ComponentRef<any> = componentFactory.create(this.injector);
    componentRef.instance.params = pageParameters;
    return componentRef;
  }

}
