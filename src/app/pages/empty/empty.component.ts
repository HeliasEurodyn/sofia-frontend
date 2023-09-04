import {AfterContentInit, Component, OnInit, TemplateRef} from '@angular/core';
import {YesNoDialogComponent} from "../../shared/yes-no-dialog/yes-no-dialog.component";
import {YesNoDialogService} from "../../shared/yes-no-dialog/yes-no-dialog.service";
import {OkDialogService} from "../../shared/ok-dialog/ok-dialog.service";

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent {

  constructor(private yesNoDialogService: YesNoDialogService,
              private okDialogService: OkDialogService) {}
  public openYesNoDialog() {
    this.yesNoDialogService.openPopup(
      '<i class="fa fa-truck-fast" style="color: red;"></i> Ερώτηση',
      'Πάμε πατακάτω ?',
'Ναι', 'Οχι', 'lg',
      (result) => {
        alert(result)
      });
  }

  public openOkDialog() {
    this.okDialogService.openPopup(
      '<i class="fa fa-truck-fast" style="color: red;"></i> Ερώτηση',
      'Πάμε παρακάτω ?',
      'Ναι',
      'lg',
      (result) => {
        alert(result);
      });
  }
}
