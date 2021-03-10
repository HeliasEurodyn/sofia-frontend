import {CommandParserService} from '../../services/command-parser.service';
import {ComponentRef, EventEmitter, Injector} from '@angular/core';

export class PageComponent {

  injector = Injector.create({
    providers: [
      {provide: CommandParserService, deps: []}
    ]
  });
  public commandParserService: CommandParserService;
  // public params: Map<string, string> = new Map();
  public params: Map<string, string> = new Map();
  public pageId: string;
  public nextPage = null;
  public previousPage = null;
  public selectEmmiter: EventEmitter<string[]> = new EventEmitter();

  constructor() {
    this.commandParserService = this.injector.get(CommandParserService);
  }

  onFocusIn() {
  }

  hasReturningValues() {
    if (this.params.has('RETURN')) {
      return true;
    } else {
      return false;
    }
  }

  setNavParams(base64Command) {
    const command = atob(base64Command);
    this.params = this.commandParserService.parse(command);
  }

  getLocateParams() {
    return this.commandParserService.parseMapPart(this.params, 'LOCATE');
  }

  getReturningDisplayValues(): Map<string, string> {
    console.log(this.params);
    return this.commandParserService.parseMapPart(this.params, 'RETURN-DISPLAY');
  }

  getTitle() {
    if (this.params.has('TITLE')) {
      return this.params.get('TITLE');
    } else {
      return '';
    }
  }

  setTitle(titleValue) {
    this.params.set('TITLE', titleValue);
  }

}
