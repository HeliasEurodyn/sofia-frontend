import { Injectable } from '@angular/core';
import {DynamicJavaScriptLoaderService} from "./dynamic-java-script-loader.service";
import {DynamicRequestService} from "../crud/dynamic-request.service";
import {CommandNavigatorService} from "./command-navigator.service";
import {DynamicStaticJavascriptLoaderService} from "./dynamic-static-javascript-loader.service";

declare function registerHtmlDashboardDynamicScript(id, list);

declare function nativeHtmlDashboardEventsHandler(id, type: string, metadata: any): any;

declare function defineHtmlDashboardNavigator(id, callback: ((command: string) => any)): void;

declare function defineHtmlDashboardGetFromBackend(id, callback: ((url: string, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardGetFromUrl(id, callback: ((url: string, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardPostToBackend(id, callback: ((url: string, data: any, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardPostToUrl(id, callback: ((url: string, data: any, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardPutToBackend(id, callback: ((url: string, data: any, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardPutToUrl(id, callback: ((url: string, data: any, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardDeleteFromBackend(id, callback: ((url: string, callback: (n: any) => any) => any)): void;

declare function defineHtmlDashboardDeleteFromUrl(id, callback: ((url: string, callback: (n: any) => any) => any)): void;

declare function nativeAreaClickHandler(id, classList): void;

@Injectable({
  providedIn: 'root'
})
export class HtmlDashboardScriptService {

  constructor(private dynamicJavaScriptLoader: DynamicJavaScriptLoaderService,
              private dynamicRequestService: DynamicRequestService,
              private navigatorService: CommandNavigatorService,
              private staticJavascriptLoader: DynamicStaticJavascriptLoaderService) {
  }

  loadWithPromise(htmlDashboard: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.staticJavascriptLoader.addScript('html-dashboard').then(result => {
        this.dynamicJavaScriptLoader.addScript(htmlDashboard.dto.id, 'html-dashboard').then(data => {
          registerHtmlDashboardDynamicScript(htmlDashboard.dto.id, htmlDashboard);
          defineHtmlDashboardNavigator(htmlDashboard.dto.id, this.navigateToCommand);
          defineHtmlDashboardGetFromBackend(htmlDashboard.dto.id, this.getFromBackend);
          defineHtmlDashboardGetFromUrl(htmlDashboard.dto.id, this.getFromUrl);
          defineHtmlDashboardPostToBackend(htmlDashboard.dto.id, this.postToBackend);
          defineHtmlDashboardPostToUrl(htmlDashboard.dto.id, this.postToUrl);
          defineHtmlDashboardPutToBackend(htmlDashboard.dto.id, this.putToBackend);
          defineHtmlDashboardPutToUrl(htmlDashboard.dto.id, this.putToUrl);
          defineHtmlDashboardDeleteFromBackend(htmlDashboard.dto.id, this.deleteFromBackend);
          defineHtmlDashboardDeleteFromUrl(htmlDashboard.dto.id, this.deleteFromUrl);
          this.triggerInfoCardEvent(htmlDashboard.dto.id, 'onInfoCardOpen', '');
          resolve({script: 'htmlDashboardScript', loaded: true, status: 'Loaded'});
        }).catch(error => console.log(error));
      });
    });
  }

  public triggerInfoCardEvent(id, type: string, metadata: any) {
    nativeHtmlDashboardEventsHandler(id, type, metadata);
  }

  public navigateToCommand = (command: string) => {
    this.navigatorService.navigate(command);
  };

  /*
 *  Get data from backend url
 * */
  public getFromBackend = (url: string, callback: (n: any) => any) => {
    this.dynamicRequestService.getFromBackend(url).subscribe(data => {
      callback(data);
    });
  };

  public getFromBackendWithCustomHeaders(url: string, customHeaders: [], callback: (n: any, result: boolean) => any) {
    this.dynamicRequestService.getFromBackendWithCustomHeaders(url, customHeaders).subscribe((response) => {
        callback(response, true);
      }, (error) => {
        callback(null, false);
      }
    );
  }

  public getFromUrlWithCustomHeaders(url: string, customHeaders: [], callback: (n: any, result: boolean) => any) {
    this.dynamicRequestService.getFromUrlWithCustomHeaders(url, customHeaders).subscribe((response) => {
        callback(response, true);
      }, (error) => {
        callback(null, false);
      }
    );
  }

  /*
 *  Get data from  url
 * */
  public getFromUrl = (url: string, callback: (n: any) => any) => {
    this.dynamicRequestService.getFromUrl(url).subscribe(data => {
      callback(data);
    });
  };


  public postToBackend = (url: string, data: any, callback: (n: any) => any) => {
    this.dynamicRequestService.postToBackend(url, data).subscribe(response => {
      callback(response);
    });
  };

  public postToUrl = (url: string, data: any, callback: (n: any) => any) => {
    this.dynamicRequestService.postToUrl(url, data).subscribe(response => {
      callback(response);
    });
  };

  public putToBackend = (url: string, data: any, callback: (n: any) => any) => {
    this.dynamicRequestService.putToBackend(url, data).subscribe(response => {
      callback(response);
    });
  };

  public putToUrl = (url: string, data: any, callback: (n: any) => any) => {
    this.dynamicRequestService.putToUrl(url, data).subscribe(response => {
      callback(response);
    });
  };

  public deleteFromBackend = (url: string, callback: (n: any) => any) => {
    this.dynamicRequestService.deleteFromBackend(url).subscribe(data => {
      callback(data);
    });
  };

  public deleteFromUrl = (url: string, callback: (n: any) => any) => {
    this.dynamicRequestService.deleteFromUrl(url).subscribe(data => {
      callback(data);
    });
  };

  public areaClickOccured(id, classList) {
    nativeAreaClickHandler(id, classList);
  }

}
