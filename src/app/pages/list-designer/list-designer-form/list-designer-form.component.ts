import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ListDTO} from '../../../dtos/list/list-dto';
import {TableComponentService} from 'app/services/crud/table-component.service';
import {ListComponentDTO} from '../../../dtos/list/list-component-dto';
import {ListComponentFieldDTO} from 'app/dtos/list/list-component-field-d-t-o';
import {ListService} from 'app/services/crud/list.service';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';
import {ComponentPersistEntityFieldDTO} from '../../../dtos/component/component-persist-entity-field-dto';
import {ComponentPersistEntityDTO} from '../../../dtos/component/component-persist-entity-dto';

@Component({
  selector: 'app-list-designer-form',
  templateUrl: './list-designer-form.component.html',
  styleUrls: ['./list-designer-form.component.css']
})
export class ListDesignerFormComponent extends PageComponent implements OnInit {

  public components: any;
  public selectedFilterField: ListComponentFieldDTO;

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

    this.selectedFilterField = new ListComponentFieldDTO();

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
        //  if (this.dto.listComponentList.length > 0) {
        //    this.selectedListComponent = this.dto;
        //  }
        this.cleanIdsIfCloneEnabled();
      });
    }

    //  this.dto.listComponentList = [];
    this.refreshComponents();
  }

  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {

      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {

        this.dto.id = null;
        this.dto.version = null;
        // for (const listComponent of this.dto.listComponentList) {
        //  listComponent.id = null;
        //    listComponent.version = null;

        for (const listComponentFieldList of this.dto.listComponentColumnFieldList) {
          listComponentFieldList.id = null;
          listComponentFieldList.version = null;
        }

        for (const listComponentFieldList of this.dto.listComponentFilterFieldList) {
          listComponentFieldList.id = null;
          listComponentFieldList.version = null;
        }

        for (const listComponentFieldList of this.dto.listComponentLeftGroupFieldList) {
          listComponentFieldList.id = null;
          listComponentFieldList.version = null;
        }

        for (const listComponentFieldList of this.dto.listComponentTopGroupFieldList) {
          listComponentFieldList.id = null;
          listComponentFieldList.version = null;
        }
        //  }
        this.mode = 'new-record';
      }
    }
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
      this.service.update(this.dto).subscribe(data => {
        //   this.router.navigate(['/list-designer-list']);
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.service.save(this.dto).subscribe(data => {
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


  selectComponent(selectedComponent) {

    this.dto.component = selectedComponent;
    this.dto.listComponentActionFieldList = [];
    this.dto.listComponentColumnFieldList = [];
    this.dto.listComponentFilterFieldList = [];
    this.dto.listComponentLeftGroupFieldList = [];
    this.dto.listComponentOrderByFieldList = [];
    this.dto.listComponentTopGroupFieldList = [];

    // const dto = new ListDTO();
    // this.dto.shortOrder = this.genNextShortOrder();
    // this.dto.code = 'c' + this.dto.shortOrder;
    // this.dto.listComponentList.push(dto);

    // this.selectedListComponent = dto;
  }

  // genNextShortOrder() {
  //   if (this.dto.listComponentList === null
  //     || this.dto.listComponentList === undefined
  //     || this.dto.listComponentList.length === 0) {
  //     return 1;
  //   }
  //
  //   const curShortOrderObject = this.dto.listComponentList.reduce(function (prev, curr) {
  //     return prev.shortOrder < curr.shortOrder ? curr : prev;
  //   });
  //
  //   return (curShortOrderObject.shortOrder + 1);
  // }


  // setSelectedComponent(row: ListComponentDTO) {
  //   this.selectedListComponent = row;
  // }

  hideChildren(item) {
    item.showFieldList = false;
  }

  showChildren(item) {
    item.showFieldList = true;
  }

  addFieldToColumns(row: ComponentPersistEntityDTO, field: ComponentPersistEntityFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentPersistEntity = row;
    dto.componentPersistEntityField = field;
    dto.visible = true;
    dto.editable = false;
    dto.description = field.description
    dto.type = field.persistEntityField.type;
    dto.shortOrder = this.genNextColumnsShortOrder();
    dto.code = 'C' + dto.shortOrder;
    dto.formulaType = 'column';
    this.dto.listComponentColumnFieldList.push(dto);
  }

  genNextColumnsShortOrder() {
    if (this.dto.listComponentColumnFieldList === null
      || this.dto.listComponentColumnFieldList === undefined
      || this.dto.listComponentColumnFieldList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.dto.listComponentColumnFieldList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }

  addFormulaFieldToFilters() {
    const dto = new ListComponentFieldDTO();
    dto.editor = '';
    dto.componentPersistEntity = null
    dto.componentPersistEntityField = null;
    dto.visible = true;
    dto.editable = false;
    dto.required = false;
    dto.description = '';
    dto.type = '';
    dto.shortOrder = this.genNextFilrerShortOrder();
    dto.code = 'F' + dto.shortOrder;
    dto.bclass = 'col-12';
    this.dto.listComponentFilterFieldList.push(dto);
  }


  addCommandFormulaFieldToColumns() {
    const dto = new ListComponentFieldDTO();
    dto.editor = '';
    dto.componentPersistEntity = null
    dto.componentPersistEntityField = null;
    dto.visible = true;
    dto.editable = false;
    dto.required = false;
    dto.description = '';
    dto.type = '';
    dto.shortOrder = this.genNextColumnsShortOrder();
    dto.code = 'C' + dto.shortOrder;
    dto.formulaType = 'command';
    this.dto.listComponentColumnFieldList.push(dto);
  }


  addSqlFormulaFieldToColumns() {
    const dto = new ListComponentFieldDTO();
    dto.editor = '';
    dto.componentPersistEntity = null
    dto.componentPersistEntityField = null;
    dto.visible = true;
    dto.editable = false;
    dto.required = false;
    dto.description = '';
    dto.type = '';
    dto.shortOrder = this.genNextColumnsShortOrder();
    dto.code = 'C' + dto.shortOrder;
    dto.formulaType = 'sql';
    this.dto.listComponentColumnFieldList.push(dto);
  }

  addActionField() {
    const dto = new ListComponentFieldDTO();
    dto.editor = '';
    dto.componentPersistEntity = null
    dto.componentPersistEntityField = null;
    dto.visible = true;
    dto.editable = false;
    dto.required = false;
    dto.description = '';
    dto.type = 'list';
    dto.shortOrder = this.genNextActionFieldShortOrder();
    dto.code = 'AC' + dto.shortOrder;
    dto.bclass = 'fa-search';
    this.dto.listComponentActionFieldList.push(dto);
  }

  genNextActionFieldShortOrder() {
    if (this.dto.listComponentActionFieldList === null
      || this.dto.listComponentActionFieldList === undefined
      || this.dto.listComponentActionFieldList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.dto.listComponentActionFieldList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }


  addFieldToFilters(row: ComponentPersistEntityDTO, field: ComponentPersistEntityFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentPersistEntity = row;
    dto.componentPersistEntityField = field;
    dto.visible = true;
    dto.editable = false;
    dto.required = false;
    dto.description = field.description
    dto.type = field.persistEntityField.type;
    dto.shortOrder = this.genNextFilrerShortOrder();
    dto.code = 'F' + dto.shortOrder;
    dto.bclass = 'col-12';

    this.dto.listComponentFilterFieldList.push(dto);
  }

  genNextFilrerShortOrder() {
    if (this.dto.listComponentFilterFieldList === null
      || this.dto.listComponentFilterFieldList === undefined
      || this.dto.listComponentFilterFieldList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.dto.listComponentFilterFieldList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }

  addFieldToGrouping(row: ComponentPersistEntityDTO, field: ComponentPersistEntityFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentPersistEntity = row;
    dto.componentPersistEntityField = field;
    dto.visible = true;
    dto.editable = false;
    dto.description = field.description
    dto.type = field.persistEntityField.type;
    dto.shortOrder = this.genNextGroupingLeftShortOrder();
    dto.code = 'GL' + dto.shortOrder;
    this.dto.listComponentLeftGroupFieldList.push(dto);
  }


  genNextGroupingLeftShortOrder() {
    if (this.dto.listComponentLeftGroupFieldList === null
      || this.dto.listComponentLeftGroupFieldList === undefined
      || this.dto.listComponentLeftGroupFieldList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.dto.listComponentLeftGroupFieldList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }


  addFieldToOrderBy(row: ComponentPersistEntityDTO, field: ComponentPersistEntityFieldDTO) {
    const dto = new ListComponentFieldDTO();
    dto.editor = field.editor;
    dto.componentPersistEntity = row;
    dto.componentPersistEntityField = field;
    dto.visible = true;
    dto.editable = false;
    dto.description = field.description
    dto.type = field.persistEntityField.type;
    dto.shortOrder = this.genNextOrderByShortOrder();
    dto.code = 'OB' + dto.shortOrder;
    this.dto.listComponentOrderByFieldList.push(dto);
  }

  genNextOrderByShortOrder() {
    if (this.dto.listComponentOrderByFieldList === null
      || this.dto.listComponentOrderByFieldList === undefined
      || this.dto.listComponentOrderByFieldList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.dto.listComponentOrderByFieldList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }


  showHideAllFields() {
    if (this.showAllFieldsDiv === false) {
      this.showAllFieldsDiv = true;
    } else {
      this.showAllFieldsDiv = false;
    }
  }

  removeColumn(column: ListComponentFieldDTO) {
    // if (this.selectedListComponent !== undefined) {
    this.dto.listComponentColumnFieldList =
      this.dto.listComponentColumnFieldList.filter(item => item !== column);
    // }
  }

  removeFilter(column: ListComponentFieldDTO) {
    if (this.dto !== undefined) {
      this.dto.listComponentFilterFieldList =
        this.dto.listComponentFilterFieldList.filter(item => item !== column);
    }
  }

  removeLeftGroupField(column: ListComponentFieldDTO) {
    if (this.dto !== undefined) {
      this.dto.listComponentLeftGroupFieldList =
        this.dto.listComponentLeftGroupFieldList.filter(item => item !== column);
    }
  }

  // removeComponent(row: ListComponentDTO) {
  //
  //   this.selectedListComponent = undefined;
  //
  //   this.dto.listComponentList =
  //     this.dto.listComponentList.filter(item => item !== row);
  // }

  setSelectedFilterField(column: ListComponentFieldDTO) {
    this.selectedFilterField = column;
  }

  generateDefaultFilterStructure() {
    let firstItteration = true;
    for (const listComponentFilterField of this.dto.listComponentFilterFieldList) {
      if (firstItteration) {
        this.dto.filterFieldStructure = '$' + listComponentFilterField.code;
      } else {
        this.dto.filterFieldStructure += ' AND $' + listComponentFilterField.code;
      }
      firstItteration = false;
    }
  }

  removeActionField(column: ListComponentFieldDTO) {
    this.dto.listComponentActionFieldList =
      this.dto.listComponentActionFieldList.filter(item => item !== column);
  }

  removeOrderByField(column: ListComponentFieldDTO) {
    this.dto.listComponentOrderByFieldList =
      this.dto.listComponentOrderByFieldList.filter(item => item !== column);
  }

  moveUp(selectedItem: ListComponentFieldDTO, list: ListComponentFieldDTO[]) {
    let position = 0;
    for (const listItem of list) {
      if (selectedItem === listItem && position > 0) {
        const prevItem = list[position - 1];
        list[position] = prevItem;
        list[position - 1] = listItem;
      }
      position++;
    }
  }

  moveDown(selectedItem: ListComponentFieldDTO, list: ListComponentFieldDTO[]) {
    let position = 0;
    for (const listItem of list) {
      if (selectedItem === listItem && (position + 1) < list.length) {
        const nextItem = list[position + 1];
        //   alert(nextItem.code + ' ' + listItem.code);
        list[position] = nextItem;
        list[position + 1] = listItem;
        break;
      }
      position++;
    }
  }


}
