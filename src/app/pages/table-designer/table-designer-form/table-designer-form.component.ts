import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TableDTO, TableFieldDTO} from '../../../dtos/table/tableDTO';
import {TableService} from '../../../services/table.service';
import {PageComponent} from '../../page/page-component';
import {NavigatorService} from '../../../services/navigator.service';


@Component({
  selector: 'app-table-designer-form',
  templateUrl: './table-designer-form.component.html',
  styleUrls: ['./table-designer-form.component.css']
})
export class TableDesignerFormComponent extends PageComponent implements OnInit {
//  public fields: any;
  public tableHeaders: any;
  public table: TableDTO;
  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: TableDTO;
  // title = 'appBootstrap';

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


    if (this.params.has('LOCATE')) {
      const locateValues = this.params.get('LOCATE');
      let locateValuesInsideBrackets = locateValues.replace(/.*\(|\).*/, '');
      locateValuesInsideBrackets = locateValuesInsideBrackets.replace(/.*\(|\).*/, '');
      const locateValuesSplited = locateValuesInsideBrackets.split(',');

      const locateValuesKeyValMap: Map<string, string> = new Map();

      for (const locateValueSplited of locateValuesSplited) {
        const locateValuesKeyVal: string[] = locateValueSplited.split('=');
        locateValuesKeyValMap.set(locateValuesKeyVal[0], locateValuesKeyVal[1]);
      }
      if (locateValuesKeyValMap.has('ID')) {
        id = locateValuesKeyValMap.get('ID');
        this.mode = 'edit-record';
      }
    }

    if (this.mode === 'edit-record') {
      this.tableDesignerService.getById(id).subscribe(data => {
        this.table = data;
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
