import {Component, OnInit} from '@angular/core';
import {TableService} from '../../../services/crud/table.service';
import {ComponentDTO} from '../../../dtos/component/componentDTO';
import {TableDTO} from '../../../dtos/table/tableDTO';
import {TableComponentService} from 'app/services/crud/table-component.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommandNavigatorService} from '../../../services/command-navigator.service';
import {PageComponent} from '../../page/page-component';
import {ComponentPersistEntityFieldDTO} from '../../../dtos/component/component-persist-entity-field-dto';
import {ComponentPersistEntityDTO} from '../../../dtos/component/component-persist-entity-dto';
import {ViewService} from '../../../services/crud/view.service';
import {MenuFieldDTO} from '../../../dtos/menu/menuDTO';
import {AppViewService} from '../../../services/crud/app-view.service';


@Component({
  selector: 'app-component-designer-form',
  templateUrl: './component-designer-form.component.html',
  styleUrls: ['./component-designer-form.component.css']
})
export class ComponentDesignerFormComponent extends PageComponent implements OnInit {

  public tables: any;
  public views: any;
  public appViews: any;

  public componentDTO = new ComponentDTO();
  public selectedTableComponent: ComponentDTO;
  public mode: string;

  tableDesign: TableDTO;
  tableComponentFieldList: ComponentPersistEntityFieldDTO[];

  constructor(private tableService: TableService,
              private viewService: ViewService,
              private appViewService: AppViewService,
              private tableComponentService: TableComponentService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigatorService: CommandNavigatorService) {
    super();
  }

  ngOnInit(): void {

    let id = '0';
    this.mode = 'new-record';
    this.componentDTO = new ComponentDTO();


    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.tableComponentService.getById(id).subscribe(data => {
        this.componentDTO = data;
        this.cleanIdsIfCloneEnabled();
      });
    }


    this.refreshTables();
    this.refreshViews();
    this.refreshAppViews();

  }

  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {

      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {

        this.componentDTO.id = null;
        this.componentDTO.version = null;
        for (const componentPersistEntity of this.componentDTO.componentPersistEntityList) {

          componentPersistEntity.id = null;
          componentPersistEntity.version = null;
          for (const componentPersistEntityField of componentPersistEntity.componentPersistEntityFieldList) {
            componentPersistEntityField.id = null;
            componentPersistEntityField.version = null;
          }
        }
        this.mode = 'new-record';
      }
    }
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

  refreshTables() {
    this.tableService.get().subscribe(data => {
      console.log(data);
      this.tables = data;
    });
  }

  refreshViews() {
    this.viewService.get().subscribe(data => {
      this.views = data;
    });
  }

  refreshAppViews() {
    this.appViewService.get().subscribe(data => {
      this.appViews = data;
    });
  }

  save() {
    if (this.mode === 'edit-record') {
      this.tableComponentService.update(this.componentDTO).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {

      this.tableComponentService.save(this.componentDTO).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    }

  }

  selectView(row) {

    const componentTableDTO = new ComponentPersistEntityDTO();
    componentTableDTO.persistEntity = row;
    componentTableDTO.showFieldList = true;
    componentTableDTO.shortOrder = this.genNextShortOrder(this.componentDTO.componentPersistEntityList);
    componentTableDTO.code = 't' + componentTableDTO.shortOrder;

    componentTableDTO.componentPersistEntityFieldList = [];
    let shortOrder = 1;
    for (const viewDesignField of row.viewFieldList) {
      const componentTableFieldDTO = new ComponentPersistEntityFieldDTO();
      componentTableFieldDTO.persistEntityField = viewDesignField;
      componentTableFieldDTO.editor = '';
      componentTableFieldDTO.description = viewDesignField.description;
      componentTableFieldDTO.shortOrder = shortOrder;
      componentTableDTO.componentPersistEntityFieldList.push(componentTableFieldDTO);
      shortOrder++;
    }

    this.componentDTO.componentPersistEntityList.push(componentTableDTO);

  }

  selectAppView(row) {

    const componentTableDTO = new ComponentPersistEntityDTO();
    componentTableDTO.persistEntity = row;
    componentTableDTO.showFieldList = true;
    componentTableDTO.shortOrder = this.genNextShortOrder(this.componentDTO.componentPersistEntityList);
    componentTableDTO.code = 't' + componentTableDTO.shortOrder;

    componentTableDTO.componentPersistEntityFieldList = [];
    let shortOrder = 1;
    for (const appViewDesignField of row.appViewFieldList) {
      const componentTableFieldDTO = new ComponentPersistEntityFieldDTO();
      componentTableFieldDTO.persistEntityField = appViewDesignField;
      componentTableFieldDTO.editor = '';
      componentTableFieldDTO.description = appViewDesignField.description;
      componentTableFieldDTO.shortOrder = shortOrder;
      componentTableDTO.componentPersistEntityFieldList.push(componentTableFieldDTO);
      shortOrder++;
    }

    this.componentDTO.componentPersistEntityList.push(componentTableDTO);

  }

  selectTable(row) {

    const componentTableDTO = new ComponentPersistEntityDTO();
    componentTableDTO.persistEntity = row;
    componentTableDTO.showFieldList = true;
    componentTableDTO.shortOrder = this.genNextShortOrder(this.componentDTO.componentPersistEntityList);
    componentTableDTO.code = 't' + componentTableDTO.shortOrder;

    componentTableDTO.componentPersistEntityFieldList = [];
    let shortOrder = 1;
    for (const tableDesignField of row.tableFieldList) {
      const componentTableFieldDTO = new ComponentPersistEntityFieldDTO();
      componentTableFieldDTO.persistEntityField = tableDesignField;
      componentTableFieldDTO.editor = '';
      componentTableFieldDTO.description = tableDesignField.description;
      componentTableFieldDTO.shortOrder = shortOrder;
      componentTableDTO.componentPersistEntityFieldList.push(componentTableFieldDTO);
      shortOrder++;
    }

    this.componentDTO.componentPersistEntityList.push(componentTableDTO);

  }

  genNextShortOrder(componentTableList: ComponentPersistEntityDTO[]) {

    if (this.componentDTO.componentPersistEntityList === null
      || this.componentDTO.componentPersistEntityList === undefined
      || this.componentDTO.componentPersistEntityList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.componentDTO.componentPersistEntityList.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }

  // toList() {
  //   this.router.navigate(['/component-designer-list']);
  // }

  delete() {
    this.tableComponentService.delete(this.tableDesign.id).subscribe(data => {
      this.navigatorService.closeAndBack(this.pageId);
    });
  }


  removeTableComponent(selectedTableComponent) {
    if (this.componentDTO.componentPersistEntityList.indexOf(selectedTableComponent) >= 0) {
      this.componentDTO.componentPersistEntityList.splice(this.componentDTO.componentPersistEntityList.indexOf(selectedTableComponent), 1);
    }
  }

  hideChildren(item) {
    item.showFieldList = false;
  }

  showChildren(item) {
    item.showFieldList = true;
  }


  upItemInList(row: ComponentPersistEntityDTO, componentPersistEntityList: ComponentPersistEntityDTO[]) {
    if (componentPersistEntityList === undefined) {
      return;
    }

    if (componentPersistEntityList.indexOf(row) > 0) {

      const position = componentPersistEntityList.indexOf(row);
      const item = componentPersistEntityList[position];
      const prevItem = componentPersistEntityList[position - 1];
      const itemshortOrder = item.shortOrder;
      item.shortOrder = prevItem.shortOrder;
      prevItem.shortOrder = itemshortOrder;
      componentPersistEntityList[position] = prevItem;
      componentPersistEntityList[position - 1] = item;
    }

  }

  downItemInList(row: ComponentPersistEntityDTO, componentPersistEntityList: ComponentPersistEntityDTO[]) {
    if (componentPersistEntityList === undefined) {
      return;
    }

    if (componentPersistEntityList.indexOf(row) < componentPersistEntityList.length - 1) {

      const position = componentPersistEntityList.indexOf(row);
      const item = componentPersistEntityList[position];
      const prevItem = componentPersistEntityList[position + 1];
      const itemshortOrder = item.shortOrder;
      item.shortOrder = prevItem.shortOrder;
      prevItem.shortOrder = itemshortOrder;
      componentPersistEntityList[position] = prevItem;
      componentPersistEntityList[position + 1] = item;
    }
  }
}
