import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ComponentPersistEntityFieldDTO} from "../../dtos/component/component-persist-entity-field-dto";

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }
  image: string | ArrayBuffer = './assets/img/upload_image.jpg';
  @Input() componentPersistEntityFieldDTO: ComponentPersistEntityFieldDTO;
  @Input() editable: Boolean;
  @Output() eventOccured = new EventEmitter<any>();

  ngOnInit(): void {
    if(this.componentPersistEntityFieldDTO.value != null){
      this.image = this.componentPersistEntityFieldDTO.value;
    }
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(resource);
  }

  onImageFileSelect(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (evnt: ProgressEvent<FileReader>) => {
        this.image = evnt.target.result;
        this.componentPersistEntityFieldDTO.value = this.image;
      }
    }
  }

  clearImage() {
    this.image = ''
    this.componentPersistEntityFieldDTO.value = null;
  }
}
