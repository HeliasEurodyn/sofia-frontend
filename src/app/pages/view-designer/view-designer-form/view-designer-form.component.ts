import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {ViewService} from 'app/services/crud/view.service';
import {ViewDTO} from '../../../dtos/view/view-dto';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';

@Component({
  selector: 'app-view-designer-form',
  templateUrl: './view-designer-form.component.html',
  styleUrls: ['./view-designer-form.component.css']
})
export class ViewDesignerFormComponent extends PageComponent implements OnInit {

  // public tableHeaders: any;
  public dto: ViewDTO;
  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: ViewDTO;
  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private service: ViewService,
              private router: Router,
              private navigatorService: NavigatorService) {
    super();
  }



  ngOnInit(): void {
    let id = '0';
    this.mode = 'new-record';
    this.dto = new ViewDTO();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.service.getById(id).subscribe(data => {
        this.dto = data;
      });
    }

    this.dto.viewFieldList = [];
  }

  save() {
    if (this.mode === 'edit-record') {
      this.service.update(this.dto).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.service.save(this.dto).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
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
      this.dto.viewFieldList = data;
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
