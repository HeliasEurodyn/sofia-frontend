import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-set-application-interface-modal',
  templateUrl: './set-application-interface-modal.component.html',
  styleUrls: ['./set-application-interface-modal.component.css']
})
export class SetApplicationInterfaceModalComponent implements OnInit {


  @Input() public url: String;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

  }

  passBack() {
    this.activeModal.close(this.url);
  }


  dismiss() {
    this.activeModal.dismiss();
  }
}
