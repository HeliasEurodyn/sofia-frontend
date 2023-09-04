import { Injectable } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {YesNoDialogComponent} from "./yes-no-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class YesNoDialogService {
  constructor(private modalService: NgbModal) { }
  public openPopup(title: string,
                   description: string,
                   btnOkText: string = 'Ok',
                   btnCancelText: string = 'Cancel',
                   dialogSize: 'sm'|'lg' = 'sm',
                   callback: (n: string) => any): void {

    const modalRef = this.modalService.open(YesNoDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.description = description;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.callback = callback;
  }

}
