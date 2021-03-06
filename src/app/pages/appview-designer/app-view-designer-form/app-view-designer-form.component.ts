import {Component, OnInit} from '@angular/core';
import {PageComponent} from '../../page/page-component';
import {ActivatedRoute, Router} from '@angular/router';
import {CommandNavigatorService} from '../../../services/command-navigator.service';
import {AppViewDTO} from '../../../dtos/appview/app-view-dto';
import {AppViewService} from '../../../services/crud/app-view.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-app-view-designer-form',
  templateUrl: './app-view-designer-form.component.html',
  styleUrls: ['./app-view-designer-form.component.css']
})
export class AppViewDesignerFormComponent extends PageComponent implements OnInit {

  public dto: AppViewDTO;
  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: AppViewDTO;
  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private service: AppViewService,
              private router: Router,
              private location: Location,
              private navigatorService: CommandNavigatorService) {
    super();
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.setNavParams(params['nav']);
    });

    let id = '0';
    this.mode = 'new-record';
    this.dto = new AppViewDTO();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.service.getById(id).subscribe(data => {
        this.dto = data;
        this.cleanIdsIfCloneEnabled();
      });
    }

    this.dto.appViewFieldList = [];
  }

  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {

      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {

        this.dto.id = null;
        this.dto.version = null;
        for (const appViewField of this.dto.appViewFieldList) {
          appViewField.id = null;
          appViewField.version = null;
        }
        this.mode = 'new-record';
      }
    }
  }

  save() {
    if (this.mode === 'edit-record') {

      this.service.update(this.dto).subscribe(data => {
        this.location.back();
      });

    } else {
      this.service.save(this.dto).subscribe(data => {
        this.location.back();
      });
    }
  }

  delete() {
    this.service.delete(this.dto.id).subscribe(data => {
      this.navigatorService.closeAndBack(this.pageId);
    });
  }

  generateViewFields() {
    this.service.generateViewFields(this.dto.query).subscribe(data => {
      this.dto.appViewFieldList = data;
    });
  }


  showPreviousPageButton() {
    if (this.previousPage === null) {
      return false;
    } else {
      return true;
    }
  }

  showNextPageButton() {
    if (this.nextPage === null) {
      return false;
    } else {
      return true;
    }
  }

  navigateToPreviousPage() {
    this.navigatorService.navigateToPreviousPage(this.pageId);
  }

  navigateToNextPage() {
    this.navigatorService.navigateToNextPage(this.pageId);
  }

}
