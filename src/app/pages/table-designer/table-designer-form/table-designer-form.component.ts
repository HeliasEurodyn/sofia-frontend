import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Table} from '../../../dtos/table';
import {TableService} from '../../../services/table.service';


@Component({
  selector: 'app-table-designer-form',
  templateUrl: './table-designer-form.component.html',
  styleUrls: ['./table-designer-form.component.css']
})
export class TableDesignerFormComponent implements OnInit {
//  public fields: any;
  public tableHeaders: any;
  public tableDesign: Table;
  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: Table;
  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private tableDesignerService: TableService,
              private router: Router) {
  }

  checkIfTableAlreadyExists() {
    this.tableDesignerService.tableExists(this.tableDesign.name).subscribe(data => {
      if (data) {
        this.tableExists = true;
      } else {
        this.tableExists = false;
      }
    });
  }


  ngOnInit(): void {
    let id = '0';

    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    if (id === '0') {
      this.mode = 'new-record';
      this.tableDesign = new Table();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.tableDesignerService.getById(id).subscribe(data => {
        this.tableDesign = data;
      });
    }


    this.tableHeaders = ['Name', 'Description', 'Type', 'Size', 'Auto Increment', 'Primary key'];

    this.tableDesign = new Table();

    this.tableDesign.tableFieldList = [
      {
        id: 0,
        shortOrder: this.shortOrder,
        name: '',
        description: '',
        type: '',
        size: '',
        createdOn: null,
        createdBy: null,
        autoIncrement: false,
        primaryKey: false,
        version: null
      }
    ];

  }

  removeLine(row) {
    if (this.tableDesign.tableFieldList.length === 1) {
      return;
    }
    this.tableDesign.tableFieldList = this.tableDesign.tableFieldList.filter(item => item !== row);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.tableDesignerService.put(this.tableDesign).subscribe(data => {
        this.router.navigate(['/table-designer-list']);
      });
    } else {
      this.tableDesignerService.post(this.tableDesign).subscribe(data => {
        this.router.navigate(['/table-designer-list']);
      });
    }
  }

  toList() {
    this.router.navigate(['/table-designer-list']);
  }

  delete() {
    this.tableDesignerService.delete(this.tableDesign.id).subscribe(data => {
      this.router.navigate(['/table-designer-list']);
    });
  }

  addLine() {
    this.shortOrder++;
    this.tableDesign.tableFieldList.push(
      {
        id: null,
        shortOrder: this.shortOrder,
        name: '',
        description: '',
        type: '',
        size: '',
        createdOn: null,
        createdBy: null,
        autoIncrement: false,
        primaryKey: false,
        version: null
      }
    );
  }
}
