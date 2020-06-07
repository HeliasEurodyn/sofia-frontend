import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {ViewService} from 'app/services/view.service';
import {ViewDTO} from '../../../dtos/view/view-dto';
import {ViewFieldDTO} from '../../../dtos/view/view-field-dto';

@Component({
  selector: 'app-view-designer-form',
  templateUrl: './view-designer-form.component.html',
  styleUrls: ['./view-designer-form.component.css']
})
export class ViewDesignerFormComponent implements OnInit {

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
              private router: Router) {
  }

  // checkIfTableAlreadyExists() {
  //   this.service.tableExists(this.dto.name).subscribe(data => {
  //     if (data) {
  //       this.tableExists = true;
  //     } else {
  //       this.tableExists = false;
  //     }
  //   });
  // }


  ngOnInit(): void {
    let id = '0';

    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (id === '0') {
      this.mode = 'new-record';
      this.dto = new ViewDTO();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.service.getById(id).subscribe(data => {
        this.dto = data;
      });
    }


    // this.tableHeaders = ['Name', 'Description', 'Type', 'Size'];

    this.dto.viewFieldList = [];

    // const viewFieldDTO = new ViewFieldDTO();
    // viewFieldDTO.id = 0;
    // viewFieldDTO.shortOrder = this.shortOrder;
    // viewFieldDTO.name = '';
    // viewFieldDTO.description = '';
    // viewFieldDTO.type = '';
    // viewFieldDTO.size = '';
    // viewFieldDTO.createdOn = null;
    // viewFieldDTO.createdBy = null;
    // viewFieldDTO.version = null;
    //
    // this.dto.viewFieldList.push(viewFieldDTO);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.service.put(this.dto).subscribe(data => {
        this.router.navigate(['/view-designer-list']);
      });
    } else {
      this.service.post(this.dto).subscribe(data => {
        this.router.navigate(['/view-designer-list']);
      });
    }
  }

  toList() {
    this.router.navigate(['/view-designer-list']);
  }

  delete() {
    this.service.delete(this.dto.id).subscribe(data => {
      this.router.navigate(['/view-designer-list']);
    });
  }

  generateViewFields() {
    this.service.generateViewFields(this.dto.query).subscribe(data => {
      this.dto.viewFieldList = data;
    });
  }


}
