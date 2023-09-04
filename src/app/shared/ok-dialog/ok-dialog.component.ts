import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-ok-dialog', templateUrl: './ok-dialog.component.html', styleUrls: ['./ok-dialog.component.css']
})
export class OkDialogComponent implements OnInit {

  public title = '';
  public description = '';
  public btnOkText: string;
  public callback: (n: string) => any

  constructor(private activeModal: NgbActiveModal, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    //  this.uuid = uuid.v4();
  }

  yesClicked() {
    this.callback('yes');
    this.activeModal.dismiss();
  }

  dismissClicked() {
    this.callback('dismiss');
    this.activeModal.dismiss();
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

}
