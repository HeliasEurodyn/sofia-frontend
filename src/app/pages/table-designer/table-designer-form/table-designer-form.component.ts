import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TableDTO, TableFieldDTO} from '../../../dtos/table/tableDTO';
import {TableService} from '../../../services/table.service';


@Component({
  selector: 'app-table-designer-form',
  templateUrl: './table-designer-form.component.html',
  styleUrls: ['./table-designer-form.component.css']
})
export class TableDesignerFormComponent implements OnInit {
//  public fields: any;
  public tableHeaders: any;
  public table: TableDTO;
  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: TableDTO;
  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private tableDesignerService: TableService,
              private router: Router) {
  }

  checkIfTableAlreadyExists() {
    this.tableDesignerService.tableExists(this.table.name).subscribe(data => {
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
      this.table = new TableDTO();
    } else {
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.tableDesignerService.getById(id).subscribe(data => {
        this.table = data;
      });
    }


    this.tableHeaders = ['Name', 'Description', 'Type', 'Size', 'Auto Increment', 'Primary key', 'Has default', 'Default', 'Unsigned', 'Not Null' ];

    this.table = new TableDTO();

    this.table.tableFieldList = [];

    const tableFieldDTO = new TableFieldDTO();
    tableFieldDTO.id = 0;
    tableFieldDTO.shortOrder = this.shortOrder;
    tableFieldDTO.name = '';
    tableFieldDTO.description = '';
    tableFieldDTO.type = '';
    tableFieldDTO.size = '';
    tableFieldDTO.createdOn = null;
    tableFieldDTO.createdBy = null;
    tableFieldDTO.autoIncrement = false;
    tableFieldDTO.primaryKey = false;
    tableFieldDTO.version = null;
    tableFieldDTO.hasDefault = false;
    tableFieldDTO.defaultValue = '';
    tableFieldDTO.isUnsigned = false;
    tableFieldDTO.hasNotNull = false;

    this.table.tableFieldList.push(tableFieldDTO);
  }

  removeLine(row) {
    if (this.table.tableFieldList.length === 1) {
      return;
    }
    this.table.tableFieldList = this.table.tableFieldList.filter(item => item !== row);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.tableDesignerService.put(this.table).subscribe(data => {
        this.router.navigate(['/dto-designer-list']);
      });
    } else {
      this.tableDesignerService.post(this.table).subscribe(data => {
        this.router.navigate(['/dto-designer-list']);
      });
    }
  }

  toList() {
    this.router.navigate(['/dto-designer-list']);
  }

  delete() {
    this.tableDesignerService.delete(this.table.id).subscribe(data => {
      this.router.navigate(['/dto-designer-list']);
    });
  }

  addLine() {
    this.shortOrder++;

    const tableFieldDTO = new TableFieldDTO();
    tableFieldDTO.id = null;
    tableFieldDTO.shortOrder = this.shortOrder;
    tableFieldDTO.name = '';
    tableFieldDTO.description = '';
    tableFieldDTO.type = '';
    tableFieldDTO.size = '';
    tableFieldDTO.createdOn = null;
    tableFieldDTO.createdBy = null;
    tableFieldDTO.autoIncrement = false;
    tableFieldDTO.primaryKey = false;
    tableFieldDTO.version = null;
    tableFieldDTO.hasDefault = false;
    tableFieldDTO.defaultValue = '';
    tableFieldDTO.isUnsigned = false;
    tableFieldDTO.hasNotNull = false;

    this.table.tableFieldList.push(tableFieldDTO);
  }
}
