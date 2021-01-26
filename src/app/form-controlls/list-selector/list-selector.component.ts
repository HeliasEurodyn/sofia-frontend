import {Component, ComponentRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommandNavigatorService} from '../../services/command-navigator.service';

@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.css']
})
export class ListSelectorComponent implements OnInit {
  @Input() command: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  displayValue = '';

  constructor(private commandNavigatorService: CommandNavigatorService) {
  }

  ngOnInit(): void {
    if (this.value != null) {
      this.initializeDefaultValues();
    }
  }

  initializeDefaultValues() {
    const valueArray = this.value.split('|');
    this.value = valueArray[0];
    this.displayValue = valueArray[1];
    this.valueChange.emit(this.value);
  }

  openPage() {
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.navigate(this.command);
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
        this.displayValue = returningValues['RETURN-DISLPAY'];
        this.value = returningValues['RETURN'];
        this.valueChange.emit(this.value);
      }
    );
  }

  keyOpenPage(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.openPage();
      document.getElementById('buttonOpen').click();
    }
  }

}
