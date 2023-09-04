import { Injectable } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {YesNoDialogComponent} from "../yes-no-dialog/yes-no-dialog.component";
import {OkDialogComponent} from "./ok-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class OkDialogService {
  constructor(private modalService: NgbModal) { }
  public openPopup(title: string,
                   description: string,
                   btnOkText: string = 'Ok',
                   dialogSize: 'sm'|'lg' = 'sm',
                   callback: (n: string) => any): void {

    const modalRef = this.modalService.open(OkDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.description = description;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.callback = callback;
  }
}
