import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ListDTO} from '../../../dtos/list/list-dto';
import {TableComponentService} from 'app/services/table-component.service';
import {ListComponentDTO} from '../../../dtos/list/list-component-dto';
import {ComponentTableDTO, ComponentTableFieldDTO} from '../../../dtos/component/componentDTO';
import {ListComponentFieldDTO} from 'app/dtos/list/list-component-field-d-t-o';
import {ListService} from 'app/services/list.service';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';

@Component({
  selector: 'app-list-designer-form',
  templateUrl: './list-designer-form.component.html',
  styleUrls: ['./list-designer-form.component.css']
})
export class ListDesignerFormComponent extends PageComponent implements OnInit {

  public components: any;
  public selectedListComponent: ListComponentDTO;
  public dto: ListDTO;
  showAllFieldsDiv: Boolean = false;

  shortOrder = 0;
  public tableExists = false;

  public mode: string;
  userDto: ListDTO;
  title = 'appBootstrap';

  public isCollapsed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private tableComponentService: TableComponentService,
              private service: ListService,
              private router: Router,
              private navigatorService: NavigatorService) {
    super();
  }


  ngOnInit(): void {
    let id = '0';
    this.dto = new ListDTO();
    this.mode = 'new-record';

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.service.getById(id).subscribe(data => {
        this.dto = data;
        if (this.dto.listComponentList.length > 0 ) {
          this.selectedListComponent = this.dto.listComponentList[0];
        }

      });
    }

    this.dto.listComponentList = [];
    this.refreshComponents();
  }


  refreshComponents() {
    this.tableComponentService.get().subscribe(data => {
      this.components = data;
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


  save() {
    if (this.mode === 'edit-record') {
      this.service.put(this.dto).subscribe(data => {
     //   this.router.navigate(['/list-designer-list']);
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.service.post(this.dto).subscribe(data => {
       // this.router.navigate(['/list-designer-list']);
        this.navigatorService.closeAndBack(this.pageId);
      });
    }
  }

  // toList() {
  //   this.router.navigate(['/list-designer-list']);
  // }

  delete() {
    this.service.delete(this.dto.id).subscribe(data => {
     // this.router.navigate(['/list-designer-list']);
      this.navigatorService.closeAndBack(this.pageId);
    });
  }


  selectComponent(row) {
    const dto = new ListComponentDTO();
    dto.component = row;
    dto.shortOrder = this.genNextShortOrder();
    dto.code = 'c' + dto.shortOrder;
    this.dto.listComponentList.push(dto);

    this.selectedListComponent = dto;
  }

  genNextShortOrder() {
    if (this.dto.listComponentList === null
      || this.dto.listComponentList === undefined
      || this.dto.listComponentList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.dto.listComponentList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }


  setSelectedComponent(row: ListComponentDTO) {
    this.selectedListComponent = row;
  }

  hideChildren(item) {
    item.showFieldList = false;
  }

  showChildren(item) {
    item.showFieldList = true;
  }


  addFieldToColumns(row: ComponentTableDTO, field: ComponentTableFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentTable = row;
    dto.componentTableField = field;
    dto.visible = true;
    dto.editable = false;
    dto.description = field.description
    dto.type = field.tableField.type;
    this.selectedListComponent.listComponentColumnFieldList.push(dto);
  }

  addFieldToFilters(row: ComponentTableDTO, field: ComponentTableFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentTable = row;
    dto.componentTableField = field;
    dto.visible = true;
    dto.editable = false;
    dto.description = field.description
    dto.type = field.tableField.type;
    this.selectedListComponent.listComponentFilterFieldList.push(dto);
  }

  addFieldToGrouping(row: ComponentTableDTO, field: ComponentTableFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentTable = row;
    dto.componentTableField = field;
    dto.visible = true;
    dto.editable = false;
    dto.description = field.description
    dto.type = field.tableField.type;
    this.selectedListComponent.listComponentLeftGroupFieldList.push(dto);
  }


  showHideAllFields() {
    if (this.showAllFieldsDiv === false) {
      this.showAllFieldsDiv = true;
    } else {
      this.showAllFieldsDiv = false;
    }
  }

  removeColumn(column: ListComponentFieldDTO) {
    if (this.selectedListComponent !== undefined) {
      this.selectedListComponent.listComponentColumnFieldList =
        this.selectedListComponent.listComponentColumnFieldList.filter(item => item !== column);
    }
  }

  removeComponent(row: ListComponentDTO) {

    this.selectedListComponent = undefined;

    this.dto.listComponentList =
      this.dto.listComponentList.filter(item => item !== row);
  }




}
