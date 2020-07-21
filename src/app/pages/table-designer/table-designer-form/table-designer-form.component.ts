import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TableDTO} from '../../../dtos/table/tableDTO';
import {TableService} from '../../../services/crud/table.service';
import {PageComponent} from '../../page/page-component';
import {NavigatorService} from '../../../services/navigator.service';
import {TableFieldDTO} from '../../../dtos/table/table-field-dto';


@Component({
  selector: 'app-table-designer-form',
  templateUrl: './table-designer-form.component.html',
  styleUrls: ['./table-designer-form.component.css']
})
export class TableDesignerFormComponent extends PageComponent implements OnInit {
  public tableHeaders: any;
  public table: TableDTO;
  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: TableDTO;


  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private tableDesignerService: TableService,
              private router: Router,
              private navigatorService: NavigatorService) {
    super();

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

  showPreviousPageButton() {
    if (this.previousPage === null) {
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

  showNextPageButton() {
    if (this.nextPage === null) {
      return false;
    } else {
      return true;
    }
  }

  ngOnInit(): void {
    let id = '0';
    this.title = 'Table Designer Entry';
    // this.title.next('Table Designer Entry :)')

    this.mode = 'new-record';
    this.table = new TableDTO();

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }


    if (this.mode === 'edit-record') {
      this.tableDesignerService.getById(id).subscribe(data => {
        this.table = data;
        this.title = 'Entry ' + this.table.name;
        this.cleanIdsIfCloneEnabled();
      });
    }


    this.tableHeaders = ['Name', 'Description', 'Type', 'Size', 'Auto Increment', 'Primary key', 'Has default', 'Default', 'Unsigned', 'Not Null'];

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



  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {

      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {

        this.table.id = null;
        this.table.version = null;
        for (const tableField of this.table.tableFieldList) {
          tableField.id = null;
          tableField.version = null;
        }
        this.mode = 'new-record';
      }
    }
  }



  removeLine(row) {
    if (this.table.tableFieldList.length === 1) {
      return;
    }
    this.table.tableFieldList = this.table.tableFieldList.filter(item => item !== row);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.tableDesignerService.update(this.table).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.tableDesignerService.save(this.table).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
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
