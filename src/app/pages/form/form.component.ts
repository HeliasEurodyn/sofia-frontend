import {Component, OnInit} from '@angular/core';
import {PageComponent} from '../page/page-component';
import {FormService} from '../../services/crud/form.service';
import {CommandNavigatorService} from '../../services/command-navigator.service';
import {FormDto} from '../../dtos/form/form-dto';
import {FormTabDto} from '../../dtos/form/form-tab-dto';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent extends PageComponent implements OnInit {

  public dto: FormDto;
  public selectedFormTab: FormTabDto

  constructor(private service: FormService,
              private navigatorService: CommandNavigatorService) {
    super();
  }

  ngOnInit(): void {
    let id = '0';
    this.dto = new FormDto();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
    }

    this.service.getById(id).subscribe(data => {
      this.dto = data;
      this.setDefaultSelectedTabs();
    });
  }

  setDefaultSelectedTabs() {
    this.selectedFormTab = null;

    if (this.dto.formTabs.length > 0) {
      this.selectedFormTab = this.dto.formTabs[0];
    } else {
      return;
    }
  }

  selectFormTab(formTab: FormTabDto) {
    this.selectedFormTab = formTab;
  }

}
