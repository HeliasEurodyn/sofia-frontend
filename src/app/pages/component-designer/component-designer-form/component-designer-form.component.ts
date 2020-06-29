import {Component, OnInit} from '@angular/core';
import {TableService} from '../../../services/table.service';
import {ComponentDTO, ComponentTableDTO, ComponentTableFieldDTO} from '../../../dtos/component/componentDTO';
import {TableDTO} from '../../../dtos/table/tableDTO';
import {TableComponentService} from 'app/services/table-component.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigatorService} from '../../../services/navigator.service';
import {PageComponent} from '../../page/page-component';


@Component({
  selector: 'app-component-designer-form',
  templateUrl: './component-designer-form.component.html',
  styleUrls: ['./component-designer-form.component.css']
})
export class ComponentDesignerFormComponent extends PageComponent implements OnInit {

  public tables: any;
  public componentDTO = new ComponentDTO();
  public selectedTableComponent: ComponentDTO;
  public mode: string;

  tableDesign: TableDTO;
  tableComponentFieldList: ComponentTableFieldDTO[];

  constructor(private tableService: TableService,
              private tableComponentService: TableComponentService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigatorService: NavigatorService) {
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
      });
    }

    this.refreshTables();
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
      this.tables = data;
    });

  }

  save() {
    if (this.mode === 'edit-record') {
      this.tableComponentService.put(this.componentDTO).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {

      this.tableComponentService.post(this.componentDTO).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    }

  }

  setSelectedTableComponent(selectedTableComponent) {
    this.selectedTableComponent = selectedTableComponent;
  }

  selectTable(row) {

    const componentTableDTO = new ComponentTableDTO();
    componentTableDTO.table = row;
    componentTableDTO.showFieldList = true;
    componentTableDTO.shortOrder = this.genNextShortOrder(this.componentDTO.componentTableList);
    componentTableDTO.code = 't' + componentTableDTO.shortOrder;

    componentTableDTO.componentTableFieldList = [];
    let shortOrder = 1;
    for (const tableDesignField of row.tableFieldList) {
      const componentTableFieldDTO = new ComponentTableFieldDTO();
      componentTableFieldDTO.tableField = tableDesignField;
      componentTableFieldDTO.editor = '';
      componentTableFieldDTO.description = tableDesignField.description;
      componentTableFieldDTO.shortOrder = shortOrder;
      componentTableDTO.componentTableFieldList.push(componentTableFieldDTO);
      shortOrder++;
    }

    this.componentDTO.componentTableList.push(componentTableDTO);

    // this.selectedTableComponent.showFieldList = true;
    // this.selectedTableComponent.componentTableList = [];
    // this.selectedTableComponent.dto = row;
    // let shortOrder = 1;
    // for (const tableDesignField of row.tableFieldList) {
    //   const tableComponentFiled = new ComponentTableField();
    //   tableComponentFiled.tableField = tableDesignField;
    //   tableComponentFiled.editor = '';
    //   tableComponentFiled.description = tableDesignField.description;
    //   tableComponentFiled.shortOrder = shortOrder;
    //   this.selectedTableComponent.componentTableList.push(tableComponentFiled);
    //   shortOrder++;
    // }

  }


  genNextShortOrder(componentTableList: ComponentTableDTO[]) {


    if (this.componentDTO.componentTableList === null
      || this.componentDTO.componentTableList === undefined
      || this.componentDTO.componentTableList.length === 0) {
      return 1;
    }

    const curShortOrderObject = this.componentDTO.componentTableList.reduce(function (prev, curr) {
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
    if (this.componentDTO.componentTableList.indexOf(selectedTableComponent) >= 0) {
      this.componentDTO.componentTableList.splice(this.componentDTO.componentTableList.indexOf(selectedTableComponent), 1);
    }
  }

  hideChildren(item) {
    item.showFieldList = false;
  }

  showChildren(item) {
    item.showFieldList = true;
  }


}
