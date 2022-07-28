import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ComponentPersistEntityDTO} from '../../../dtos/sofia/component/component-persist-entity-dto';
import {ComponentPersistEntityFieldDTO} from '../../../dtos/sofia/component/component-persist-entity-field-dto';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {

  @Output() eventOccured = new EventEmitter<any>();
  @Input() editable: Boolean;
  @Input() componentPersistEntityDTO: ComponentPersistEntityDTO;
  @Input() componentPersistEntityFieldDTO: ComponentPersistEntityFieldDTO;
  @Input() command: string;
  fileName: string;
  cpeFieldFileName: ComponentPersistEntityFieldDTO;
  @ViewChild('sidebarImageFileUploader') sidebarImageFileUploader: ElementRef;

  constructor() {
  }

  ngOnInit(): void {

    if (this.isJsonString(this.command)) {
      const command = JSON.parse(this.command);
      this.retrieveFileNameField(command.fileName)
    }
  }

  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  onFileSelect(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (evnt: ProgressEvent<FileReader>) => {
        if (typeof evnt.target.result === 'string') {
          this.componentPersistEntityFieldDTO.value = evnt.target.result;
          this.fileName = event.target.files[0].name;
          this.cpeFieldFileName.value = event.target.files[0].name;
          console.log(this.componentPersistEntityFieldDTO.value);
        }
      }
    }
  }

  eventOccuredActions(eventtype: string, event: any) {
    this.eventOccured.emit(
      {
        entityCode: (this.componentPersistEntityDTO == null ? '' : this.componentPersistEntityDTO.code),
        fieldCode: (this.componentPersistEntityFieldDTO == null ? '' : this.componentPersistEntityFieldDTO.code),
        eventtype: eventtype,
        event: event
      }
    );
  }

  download() {
    const element = document.createElement('a');
    element.setAttribute('href', this.componentPersistEntityFieldDTO.value);
    element.setAttribute('download', this.fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  openFileSelector() {
    if (this.editable) {
      this.sidebarImageFileUploader.nativeElement.click();
    }
  }

  private retrieveFileNameField(fieldName: string): void {
    this.componentPersistEntityDTO.componentPersistEntityFieldList
      .forEach(cpef => {
        const currentfield = this.componentPersistEntityDTO.code + '.' + cpef.code;
        if (fieldName === currentfield) {
          this.cpeFieldFileName = cpef;
          this.fileName = cpef.value;
        }
      });
  }

}
