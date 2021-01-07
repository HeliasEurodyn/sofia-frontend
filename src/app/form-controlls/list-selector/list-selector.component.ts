import {
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {CommandNavigatorService} from '../../services/command-navigator.service';
import {CommandParserService} from '../../services/command-parser.service';

@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.css']
})
export class ListSelectorComponent implements OnInit {

  @ViewChild('pageDiv') pageDiv: ElementRef;
  @Input() command: string;
  @Output() returnValueEmmiter = new EventEmitter<string>();
  returnDisplay = '';
  returnValue = '';

  constructor(private commandNavigatorService: CommandNavigatorService,
              private commandParserService: CommandParserService,
              private appRef: ApplicationRef,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  openPage() {
    const commandParametersKeyValMap: Map<string, string> = this.commandParserService.parse(this.command);
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.generateComponent(commandParametersKeyValMap);
    this.renderPage(componentRefOnNavigation);
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
        this.returnDisplay = returningValues['RETURN-DISLPAY'];
        this.returnValue = returningValues['RETURN'];
        this.returnValueEmmiter.emit(this.returnValue);
        document.getElementById('buttonClose').click();
      }
    );
  }

  keyOpenPage(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      document.getElementById('buttonOpen').click();
    }
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

}
