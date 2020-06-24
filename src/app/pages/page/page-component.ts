import {ComponentRef} from '@angular/core';

export class PageComponent {

  public pageId: string;
  public title: string;
  public params: Map<string, string> = new Map();

  public nextPage = null;
  public previousPage = null;

  constructor() {
  }

//  public title: Subject<string> = new BehaviorSubject('');

  // public tabId: string;
  // public hasNextPage: Boolean;
  // public hasPreviousPage: Boolean;
  // @Output() tabNavigationEmitter = new EventEmitter<string>();


  // setPageId(pageId) {
  //   this.pageId = pageId
  // }

  // navigateTo(command: string ) {
  // //   this.tabNavigationEmitter.emit(command);
  //  }


}
