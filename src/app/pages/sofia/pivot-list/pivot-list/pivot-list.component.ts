import {Component, Input, OnInit} from '@angular/core';
import {ListDTO} from '../../../../dtos/sofia/list/list-dto';
import {ListResultsData} from '../../../../dtos/sofia/list/list-results-data';
import {CommandNavigatorService} from '../../../../services/system/sofia/command-navigator.service';
import {NotificationService} from '../../../../services/system/sofia/notification.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {TableComponentService} from '../../../../services/crud/sofia/table-component.service';
import {Title} from '@angular/platform-browser';
import {ListScriptsService} from '../../../../services/system/sofia/list-scripts.service';
import {DynamicCssScriptLoaderService} from '../../../../services/system/sofia/dynamic-css-script-loader.service';
import {concatMap} from 'rxjs/operators';
import {ListComponentFieldDTO} from '../../../../dtos/sofia/list/list-component-field-d-t-o';
import {ListActionButton} from '../../../../dtos/sofia/list/list-action-button';
import {PageComponent} from '../../page/page-component';
import {PivotListService} from '../../../../services/crud/sofia/pivot-list.service';

class FieldBranch {

  code: string;
  displayValue: String;
  type: string;
  colspan: number;
  rowspan: number;
  children: FieldBranch[];
  listRows: Array<string[]>;

  isBottomBranch: Boolean;
  isVisible: Boolean;
  isHiddenByParrent: Boolean;
  islineHidden: Boolean;

  constructor() {
    this.rowspan = 1;
    this.colspan = 1;
    this.isVisible = true;
    this.isHiddenByParrent = false;
    this.islineHidden = false;
    this.children = [];
  }

  // value: String;
}

@Component({
  selector: 'app-pivol-list',
  templateUrl: './pivot-list.component.html',
  styleUrls: ['./pivot-list.component.css']
})
export class PivotListComponent extends PageComponent implements OnInit {

  public topFieldTree: FieldBranch[] = [];
  public leftFieldTree: FieldBranch[] = [];

  public topViewArrayLines = new Array<FieldBranch[]>();
  public leftViewArrayLines = new Array<FieldBranch[]>();

  public topArrayLines = new Array<FieldBranch[]>();
  public leftArrayLines = new Array<FieldBranch[]>();

  public valuesArray = new Array<FieldBranch[]>();

  public totalTopCols = 0;

  public listDto: ListDTO;
  public listResultsData: ListResultsData;
  public groupContent: Array<Map<string, any>>;

  public showPrevPagination = false;
  public showNextPagination = false;

  public listHeaderVisible: Boolean = false;
  public filterHeaderVisible: Boolean = false;

  public listBodyVisible: Boolean = true;
  public focusedFieldValue: any;

  public topLeftColspan = 0;
  public topLeftRowspan = 0;

  @Input() public embeded = false;
  @Input() public embededParams = '';

  public hideSideMenus = false;

  constructor(private service: PivotListService,
              private commandNavigatorService: CommandNavigatorService,
              private notificationService: NotificationService,
              public datepipe: DatePipe,
              private activatedRoute: ActivatedRoute,
              private tableComponentService: TableComponentService,
              private title: Title,
              private listScriptsService: ListScriptsService,
              private dynamicCssScriptLoader: DynamicCssScriptLoaderService) {
    super();
  }

  counter(i: number) {
    return new Array(i);
  }

  ngOnInit(): void {
    this.initNav(this.activatedRoute);

    if (this.getLocateParams().has('ID')) {
      const id = this.getLocateParams().get('ID');
      this.refresh(id);
    }
  }

  refresh(id): void {
    this.listDto = new ListDTO();
    this.service.getVersion(id)
      .pipe(concatMap(instanceVersion => this.service.getListById(id, instanceVersion)))
      .subscribe(dto => {

        localStorage.setItem('cachedList' + id, JSON.stringify(dto));

        this.listDto = dto;
        this.listHeaderVisible = this.listDto.listVisible;
        this.filterHeaderVisible = this.listDto.filterVisible;

        this.setDafaultCommandParams();
        this.dynamicCssScriptLoader.addScript(id, 'list');
        this.defineTitle();

        this.listScriptsService.loadWithPromise(this).then(data => {
          if (this.listDto.autoRun) {
            this.getListResultData();
          }
        });

      });
  }

  defineTitle() {
    if (this.commandShowCustomTitle()) {
      this.title.setTitle(this.getWindowCustomTitleFromCommand());
    }
  }

  getListResultData() {

    /*
    * Check for required Fields
    * */
    let requiredFiledsEmpty = false;
    for (const filterField of this.listDto.listComponentFilterFieldList) {
      if ((filterField.fieldValue == null || filterField.fieldValue === '') && filterField.required) {
        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card',
          '<b>Filters error</b> Required filter field ' + filterField.description + ' is empty!');
        requiredFiledsEmpty = true;
      }
    }

    if (requiredFiledsEmpty) {
      return;
    }

    /*
     * Retrieve Values Array from filter fields
     * */
    const values = new Map();
    for (const filterField of this.listDto.listComponentFilterFieldList) {
      if (filterField.fieldValue != null && filterField.fieldValue !== '') {
        let fieldValue = '';
        if (filterField.type === 'datetime') {
          fieldValue = this.datepipe.transform(filterField.fieldValue, 'yyyyMMddHHmmss', 'UTC');
        } else {
          fieldValue = filterField.fieldValue;
        }
        values.set(filterField.code, fieldValue);
      }
    }

    this.service.getListResult(values, this.listDto.id).subscribe(data => {
      this.listResultsData = data;
      this.createPivot();
      this.listScriptsService.triggerListEvent(this.listDto.id, 'onListDataLoaded', data);
    });

  }

  export_xls() {
    let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

    tab_text = tab_text + '<table border="1px"">';
    tab_text = tab_text + '<tr><td rowspan="2" style="cursor: pointer;border: 1px solid #b3d7ff;background-color: #f7f7f7;padding: 130px;">a</td><td>b</td></tr>';
    tab_text = tab_text + '<tr><td>c</td></tr>';
    tab_text = tab_text + '</table></body></html>';

    const data_type = 'data:application/vnd.ms-excel';

    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      if (window.navigator.msSaveBlob) {
        const blob = new Blob([tab_text], {
          type: 'application/csv;charset=utf-8;'
        });
        navigator.msSaveBlob(blob, 'Test file.xlsx');
      }
    } else {
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = data_type + ', ' + encodeURIComponent(tab_text);
      downloadLink.download = 'Test file.xlsx';
      downloadLink.click();
    }
  }

  // createPivot() {
  //
  //   /* Create Left & Top Trees */
  //   this.leftFieldTree = this.createFieldTree(this.listDto.listComponentLeftGroupFieldList, this.listResultsData);
  //   this.topFieldTree = this.createFieldTree(this.listDto.listComponentTopGroupFieldList, this.listResultsData);
  //
  //   /* Create Left & Top View Array Lines */
  //   this.leftViewArrayLines = [];
  //   this.leftViewArrayLines = this.leftTreeToViewArray(this.leftFieldTree);
  //
  //   this.topViewArrayLines = [];
  //   this.topTreeToViewArray(this.topFieldTree, this.topViewArrayLines, 0,
  //     this.listDto.listComponentColumnFieldList.length);
  //
  //   /* Create Left & Top  Array Lines */
  //   this.leftArrayLines = [];
  //   this.leftArrayLines = this.treeToArray(this.leftFieldTree);
  //
  //   this.topArrayLines = [];
  //   this.topArrayLines = this.treeToArray(this.topFieldTree);
  //
  //   /* Create Values Array */
  //   this.valuesArray =
  //     this.calcValueArray(this.leftArrayLines, this.topArrayLines, this.listDto.listComponentColumnFieldList);
  //
  //   /* Counters */
  //   this.totalTopCols = this.topViewArrayLines[(this.topViewArrayLines.length - 1)].length;
  //   this.topLeftColspan = this.findTopLeftColspan(this.leftViewArrayLines);
  //
  //   /* Combine Values Array to Left View Array Lines */
  //   for (let i = 0; i < this.leftViewArrayLines.length; i++) {
  //     this.leftViewArrayLines[i] = this.leftViewArrayLines[i].concat(this.valuesArray[i]);
  //   }
  // }

  createPivot() {
    this.createPivotTrees();
    this.editPivotLinesVisibility();
    this.createPivotViewArrays();
    this.createPivotArrays();
    this.createPivotValuesArray();

    // /* Create Left & Top View Array Lines */
    // this.leftViewArrayLines = [];
    // this.leftViewArrayLines = this.leftTreeToViewArray(this.leftFieldTree);
    //
    // this.topViewArrayLines = [];
    // this.topTreeToViewArray(this.topFieldTree, this.topViewArrayLines, 0,
    //   this.listDto.listComponentColumnFieldList.length);

    // /* Create Left & Top  Array Lines */
    // this.leftArrayLines = [];
    // this.leftArrayLines = this.treeToArray(this.leftFieldTree);
    //
    // this.topArrayLines = [];
    // this.topArrayLines = this.treeToArray(this.topFieldTree);
    //
    // /* Create Values Array */
    // this.valuesArray =
    //   this.calcValueArray(this.leftArrayLines, this.topArrayLines, this.listDto.listComponentColumnFieldList);
    //
    // /* Counters */
    // this.totalTopCols = this.topViewArrayLines[(this.topViewArrayLines.length - 1)].length;
    // this.topLeftColspan = this.findTopLeftColspan(this.leftViewArrayLines);
    //
    // /* Combine Values Array to Left View Array Lines */
    // for (let i = 0; i < this.leftViewArrayLines.length; i++) {
    //   this.leftViewArrayLines[i] = this.leftViewArrayLines[i].concat(this.valuesArray[i]);
    // }
  }

  refreshPivot() {
    this.editPivotLinesVisibility();
    this.createPivotViewArrays();
    this.createPivotArrays();
    this.createPivotValuesArray();
  }

  createPivotTrees() {
    /* Create Left & Top Trees */
    this.leftFieldTree = this.createFieldTree(this.listDto.listComponentLeftGroupFieldList, this.listResultsData);
    this.topFieldTree = this.createFieldTree(this.listDto.listComponentTopGroupFieldList, this.listResultsData);
  }

  createPivotViewArrays() {

    /* Create Left & Top View Array Lines */
    this.leftViewArrayLines = [];
    this.leftViewArrayLines = this.leftTreeToViewArray(this.leftFieldTree);

    this.topViewArrayLines = [];
    this.topTreeToViewArray(this.topFieldTree, this.topViewArrayLines, 0,
      this.listDto.listComponentColumnFieldList.length);

  }

  editPivotLinesVisibility() {

    const topVisibilityLineArray = new Array<FieldBranch[]>();
    this.treeToVisibilityLineArray(this.topFieldTree, topVisibilityLineArray, 0);

    const leftVisibilityLineArray = new Array<FieldBranch[]>();
    this.treeToVisibilityLineArray(this.leftFieldTree, leftVisibilityLineArray, 0);

    topVisibilityLineArray.concat(leftVisibilityLineArray).forEach(line => {
      let islineHidden = true;

      if ( line.filter(field => !field.isHiddenByParrent).length > 0) {
        islineHidden = false;
      }

      line.forEach(field => field.islineHidden = islineHidden);
    });

  }


  createPivotArrays() {

    /* Create Left & Top  Array Lines */
    this.leftArrayLines = [];
    this.leftArrayLines = this.treeToArray(this.leftFieldTree);

    this.topArrayLines = [];
    this.topArrayLines = this.treeToArray(this.topFieldTree);
  }

  createPivotValuesArray() {

    // console.log('this.topArrayLines');
    // console.log(this.topArrayLines);
    // console.log('this.topArrayLines end');

    /* Create Values Array */
    this.valuesArray =
      this.calcValueArray(this.leftArrayLines, this.topArrayLines, this.listDto.listComponentColumnFieldList);

    /* Counters */
    this.totalTopCols = this.findTotalTopCols(this.topFieldTree, 0);

    /* Calculate colspan & rowspan for Top Left td */
    this.topLeftColspan = 0;
    this.leftArrayLines[0].forEach(fieldBranch => this.topLeftColspan += fieldBranch.colspan);

     this.topLeftRowspan = 1;
     this.topArrayLines[0].forEach(field => this.topLeftRowspan += field.rowspan);

    /* Combine Values Array to Left View Array Lines */
    for (let i = 0; i < this.leftViewArrayLines.length; i++) {
      this.leftViewArrayLines[i] = this.leftViewArrayLines[i].concat(this.valuesArray[i]);
    }
  }

  findTotalTopCols(branches: FieldBranch[], totalTopCols): number {
    branches.forEach(branch => {
      if (branch.isBottomBranch || !branch.isVisible) {
        totalTopCols += 1;
      }

      if (branch.children != null && branch.isVisible) {
        totalTopCols = this.findTotalTopCols(branch.children, totalTopCols)
      }
    });

    return totalTopCols;
  }

  createFieldTree(fieldList: ListComponentFieldDTO[], listResultsData: ListResultsData): FieldBranch[] {
    // let branchId = 1;
    const fieldTree: FieldBranch[] = [];
    listResultsData.listContent.forEach(row => {
      let branch: FieldBranch;
      let curLeftFieldBranches: FieldBranch[] = fieldTree;
      fieldList.forEach(lgField => {
        const fieldValue = row[lgField.code];
        const selectedBranch = curLeftFieldBranches.filter(x => x.displayValue === fieldValue);
        if (selectedBranch.length === 0) {
          branch = new FieldBranch();
          // branch.id = branchId++;
          branch.code = lgField.code;
          branch.displayValue = fieldValue;
          branch.type = 'group';
          branch.children = [];
          branch.listRows = [];
          branch.isBottomBranch = false;
          branch.isVisible = true;
          curLeftFieldBranches.push(branch);
        } else {
          branch = selectedBranch[0];
        }
        curLeftFieldBranches = branch.children;
      });

      branch.listRows.push(row);
      branch.isBottomBranch = true;
    });

    return fieldTree;
  }

  createSpansOnTopTree(fieldTree: FieldBranch[], multiplier: number): number {
    fieldTree.forEach(branch => {
      let span = multiplier;
      if (branch.children.length > 0) {
        span = this.createSpansOnTopTree(branch.children, multiplier);
      }
      branch.colspan = span;
    });

    let totalSpan = 0;
    fieldTree.forEach(branch => {
      totalSpan += branch.colspan;
    });

    return totalSpan;
  }

  getTopTreeValueLinesList(topFieldTree: FieldBranch[], rowLinesList: Array<Array<string[]>>) {

    topFieldTree
      .filter(fieldBranch => fieldBranch.isBottomBranch === true)
      .forEach(fieldBranch => {
        rowLinesList.push(fieldBranch.listRows);
      });

    topFieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0) {
        this.getTopTreeValueLinesList(fieldBranch.children, rowLinesList);
      }
    });
  }

  leftTreeToArray(leftFieldTree: FieldBranch[]): Array<FieldBranch[]> {
    const arrayLines: Array<FieldBranch[]> = new Array<FieldBranch[]>();
    leftFieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0) {
        const childArrayLines: FieldBranch[][] = this.leftTreeToArray(fieldBranch.children);
        childArrayLines.forEach(childLine => {
          arrayLines.push([fieldBranch].concat(childLine));
        });
      } else {
        arrayLines.push([fieldBranch]);
      }
    });

    return arrayLines;
  }

  topTreeToViewArray(fieldTree: FieldBranch[], arrayLines: Array<FieldBranch[]>, branchLevel: number, colSpanMultiplier) {
    if (arrayLines[branchLevel] == null) {
      arrayLines[branchLevel] = fieldTree;
    } else {
      const curArrayLines: FieldBranch[] = arrayLines[branchLevel];
      arrayLines[branchLevel] = curArrayLines.concat(fieldTree);
    }

    fieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0 && fieldBranch.isVisible) {
        fieldBranch.rowspan = 1;
        fieldBranch.colspan = fieldBranch.children.length * colSpanMultiplier;
        this.topTreeToViewArray(fieldBranch.children, arrayLines, (branchLevel + 1), colSpanMultiplier);
      } else if (fieldBranch.children.length > 0) {
        const rowspan = this.findTreeRemainingDepth(fieldBranch, 1);
        fieldBranch.rowspan = rowspan;
        fieldBranch.colspan = colSpanMultiplier;
      } else {
        fieldBranch.rowspan = 1;
        fieldBranch.colspan = colSpanMultiplier;
      }
    });
  }

  treeToVisibilityLineArray(fieldTree: FieldBranch[], arrayLines: Array<FieldBranch[]>, branchLevel: number) {
    if (arrayLines[branchLevel] == null) {
      arrayLines[branchLevel] = fieldTree;
    } else {
      const curArrayLines: FieldBranch[] = arrayLines[branchLevel];
      arrayLines[branchLevel] = curArrayLines.concat(fieldTree);
    }

    fieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0) {
        this.treeToVisibilityLineArray(fieldBranch.children, arrayLines, (branchLevel + 1));
      }
    });
  }

  leftTreeToViewArray(fieldTree: FieldBranch[]): Array<FieldBranch[]> {
    const arrayLines: Array<FieldBranch[]> = new Array<FieldBranch[]>();
    fieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0 && fieldBranch.isVisible) {
        const childArrayLines: FieldBranch[][] = this.leftTreeToViewArray(fieldBranch.children);
        let rowspan = 0;
        fieldBranch.children.forEach(childBranch => rowspan += childBranch.rowspan);
        let counter = 0;

        childArrayLines.forEach(childLine => {
          if (counter === 0) {
            fieldBranch.rowspan = rowspan;
            fieldBranch.colspan = 1;
            arrayLines.push([fieldBranch].concat(childLine));
          } else {
            arrayLines.push(childLine);
          }
          counter++;
        });
      } else if (fieldBranch.children.length > 0) {
        const colspan = this.findTreeRemainingDepth(fieldBranch, 1);
        fieldBranch.rowspan = 1;
        fieldBranch.colspan = colspan;
        arrayLines.push([fieldBranch]);
      } else {
        fieldBranch.rowspan = 1;
        fieldBranch.colspan = 1;
        arrayLines.push([fieldBranch]);
      }
    });
    return arrayLines;
  }

  treeToArray(fieldTree: FieldBranch[]): Array<FieldBranch[]> {
    const arrayLines: Array<FieldBranch[]> = new Array<FieldBranch[]>();
    fieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0 && fieldBranch.isVisible) {
        const childArrayLines: FieldBranch[][] = this.treeToArray(fieldBranch.children);
        childArrayLines.forEach(childLine => {
          arrayLines.push([fieldBranch].concat(childLine));
        });
      } else {
        arrayLines.push([fieldBranch]);
      }
    });
    return arrayLines;
  }

  createArrayFromTree(fieldTree: FieldBranch[]): FieldBranch[][] {
    const arrayLines: FieldBranch[][] = [];
    fieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0) {
        const childArrayLines: FieldBranch[][] = this.createArrayFromTree(fieldBranch.children);
        childArrayLines.forEach(childLine => {
          arrayLines.push([fieldBranch].concat(childLine));
        });
      } else {
        arrayLines.push([fieldBranch]);
      }
    });
    return arrayLines;
  }

  reverseArray(array: FieldBranch[][]): FieldBranch[][] {
    const arrayLines: FieldBranch[][] = [];
    const totalRows = array.length;
    const totalCols = array[0].length;

    for (let colIndex = 0; colIndex < totalCols; colIndex++) {
      const line: FieldBranch[] = [];
      for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        line.push(array[rowIndex][colIndex]);
      }
      arrayLines.push(line);
    }

    return arrayLines;
  }

  countTreePaths(fieldTree: FieldBranch[]): number {
    let pathCount = 0;
    fieldTree.forEach(fieldBranch => {
      if (fieldBranch.children.length > 0) {
        const childPathCount: number = this.countTreePaths(fieldBranch.children);
        pathCount += childPathCount;
      } else {
        pathCount += 1;
      }
    });
    return pathCount;
  }

  listDeleteCommandExecute(command) {
    const commandParameters: Map<string, string> = this.commandParserService.parse(command);
    const commandType = commandParameters.get('COMMAND-TYPE');

    if (commandType === 'LIST-DELETE' && commandParameters.has('COMPONENT-ID') && commandParameters.has('SELECTION-ID')) {
      this.tableComponentService.deleteComponentData(commandParameters.get('COMPONENT-ID'),
        commandParameters.get('SELECTION-ID')).subscribe(data => {
        this.getListResultData();
      });
    }
  }

  updateVisibility(item) {
    if (item['childrenVisible']) {
      item['childrenVisible'] = false;
    } else {
      item['childrenVisible'] = true;
    }
  }

  filterGroup(item) {
    this.clearValuesToListComponentLeftGroupFieldList();
    this.setValueToListComponentLeftGroupFieldList(item['code'], item['value']);
    if (item['parrent'] != null) {
      this.filterGroupParrent(item['parrent'])
    }
    this.getListResultData();
  }

  filterGroupOnField(field: ListComponentFieldDTO) {
    let fieldFound = false;
    let fieldUpdated = false;
    for (const leftGroupingField of this.listDto.listComponentLeftGroupFieldList) {
      if (fieldFound) {
        leftGroupingField.fieldValue = '';
        fieldUpdated = true;
      }
      if (leftGroupingField.id === field.id) {
        fieldFound = true;
      }
    }

    if (fieldUpdated) {
      this.getListResultData();
    }
  }

  clearFilterGroup() {
    this.clearValuesToListComponentLeftGroupFieldList();
    this.getListResultData();
  }

  filterGroupParrent(item) {
    this.setValueToListComponentLeftGroupFieldList(item['code'], item['value']);
    if (item['parrent'] != null) {
      this.filterGroupParrent(item['parrent'])
    }
  }

  isGroupContentDivVisible() {
    if (this.listDto.listComponentLeftGroupFieldList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  columnFilterRefreshData(event: KeyboardEvent, colIndex: number) {

    if (event.shiftKey && event.key === 'ArrowLeft') {
      const tds = document.getElementsByClassName('header-col-' + (colIndex - 1));
      if (tds.length > 0) {
        this.findContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.shiftKey && event.key === 'ArrowRight') {
      const tds = document.getElementsByClassName('header-col-' + (colIndex + 1));
      if (tds.length > 0) {
        this.findContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.shiftKey && event.key === 'ArrowDown') {
      const tds = document.getElementsByClassName('row-0-col-' + colIndex);
      if (tds.length > 0) {
        this.findContorlField((tds[0] as HTMLElement).children);
      }
    }

    if (event.altKey && event.key === 'Enter') {
      if (this.listResultsData.listContent.length === 1) {
        const row = this.listResultsData.listContent[0];
        this.emitReturningValues(row);
      }
    }

    if (event.key === 'Enter') {
      this.getListResultData();
    }

  }

  emitReturningValues(row) {
    if (this.params.has('RETURN')) {
      const emitData: string[] = [];
      const returnCode = this.params.get('RETURN');
      if (returnCode in row) {
        emitData['RETURN'] = row[returnCode];
      }

      const returnDisplayArray: string[] = [];
      const displayValues: Map<string, string> = this.getReturningDisplayValues();
      for (const [displayValueKey, displayValue] of displayValues) {
        if (displayValueKey in row) {
          returnDisplayArray.push(row[displayValueKey]);
        }
      }
      emitData['RETURN-DISLPAY'] = returnDisplayArray.join(' ');
      emitData['EXECUTED'] = true;
      this.selectEmmiter.emit(emitData);
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
    this.commandNavigatorService.navigateToPreviousPage(this.pageId);
  }

  headerActionButtonClicked(actionButton: ListActionButton) {
    this.listScriptsService.listNativeHeaderButtonClickHandler(this.listDto.id, actionButton.code);
    this.commandNavigatorService.navigate(actionButton.editor);
  }

  showTopHeader() {
    if ((this.listDto.headerIcon == null ? 0 : this.listDto.headerIcon.length) > 0) {
      return true;
    }
    if ((this.listDto.headerTitle == null ? 0 : this.listDto.headerTitle.length) > 0) {
      return true;
    }
    if ((this.listDto.headerDescription == null ? 0 : this.listDto.headerDescription.length) > 0) {
      return true;
    }

    return false;
  }

  groupHasChildred(children: any[]) {
    const childrenCount = children.filter(x => (x.value == null ? '' : x.value) !== '').length;
    if (childrenCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  hasSelections(list: ListComponentFieldDTO[]) {
    const selectionsCount = list.filter(x => (x.fieldValue == null ? '' : x.fieldValue) !== '').length;
    if (selectionsCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  calcColSpan(listComponentActionFieldList: ListComponentFieldDTO[], listComponentColumnFieldList: ListComponentFieldDTO[]) {
    let colspan = 0;
    if (listComponentColumnFieldList != null) {
      colspan = listComponentColumnFieldList.length;
    }

    if (listComponentActionFieldList != null) {
      if (listComponentActionFieldList.length > 0) {
        colspan += 1;
      }
    }

    return colspan
  }

  filterHiddenColumns(listComponentColumnFieldList: ListComponentFieldDTO[]) {
    if (listComponentColumnFieldList == null) {
      return null;
    }
    return listComponentColumnFieldList.filter(x => x.visible);
  }

  filterHiddenRows(listContent: Array<string[]>) {
    if (listContent == null) {
      return null;
    }

    return listContent.filter(x => {
      if (x['hide-row'] === true) {
        return false;
      } else {
        return true;
      }
    });
  }

  listEventOccured(event: any, column: ListComponentFieldDTO, row: string[]) {
    if (['listselected', 'listcleared'].includes(event.eventtype)) {
      //  this.updateListField(column, row);
    }
  }

  showHideSideMenus() {
    if (this.hideSideMenus) {
      this.hideSideMenus = false;
    } else {
      this.hideSideMenus = true;
    }
  }

  editBranchVisibility(branch: FieldBranch) {
    if (branch.isVisible) {
      branch.isVisible = false;
      this.editChildBranchesVisibility(branch.children, true);
    } else {
      branch.isVisible = true;
      this.editChildBranchesVisibility(branch.children, false);
    }
  }

  private findTreeRemainingDepth(fieldBranch: FieldBranch, depth: number): number {
    if (fieldBranch.children.length > 0) {
      let newDepth = depth;
      if ( !fieldBranch.children[0].islineHidden) {
        newDepth += 1;
      }

      return this.findTreeRemainingDepth(fieldBranch.children[0], newDepth);
    }
    return depth;
  }

  private calcValueArray(leftArrayLines: FieldBranch[][],
                         topArrayLines: FieldBranch[][],
                         listColumnFields: ListComponentFieldDTO[]): FieldBranch[][] {
    const valueArray: FieldBranch[][] = [];
    const id = 0;

    leftArrayLines.forEach(leftArrayLine => {


      const listRows: Array<string[]> = this.findListRowsOfArrayLine(leftArrayLine);
      // console.log('listRows');
      // console.log(leftArrayLine);
      // console.log(listRows);
      // console.log('listRows end');
    //  const listRows: Array<string[]> = leftArrayLine[leftArrayLine.length - 1].listRows;
      const valueLine: FieldBranch[] = [];

      topArrayLines.forEach(topArrayLine => {

        const filteredRows: Array<string[]> =
          this.filterRows(listRows, topArrayLine);
        listColumnFields.forEach(columnField => {
          const valueBranch = this.calcValueBranch(columnField, filteredRows, leftArrayLine, topArrayLine);
          // const valueBranch =
          //   this.listScriptsService.calcPivotValueBranch(this.listDto.id, columnField, filteredRows, leftArrayLine, topArrayLine);
          valueLine.push(valueBranch);
        });

      });

      valueArray.push(valueLine);
    });

    return valueArray;
  }

  private findListRowsOfArrayLine(arrayLines: FieldBranch[]): Array<string[]> {
    const isBottomBranch = arrayLines[arrayLines.length - 1].isBottomBranch;
    console.log('listRows');
    console.log(arrayLines);
    if (isBottomBranch) {
      console.log('isBottomBranch true');
      return arrayLines[arrayLines.length - 1].listRows;
    }

    const listRows: Array<string[]> = new Array();
    this.findListRowsOfBranches(arrayLines[arrayLines.length - 1].children, listRows );

    console.log('listRows end');
    return listRows;
  }

  private findListRowsOfBranches(branches: FieldBranch[], listRows: Array<string[]>) {

    branches.forEach(field => {
      console.log(field.isBottomBranch);
      console.log(field.listRows);
       if (field.isBottomBranch) {
         field.listRows.forEach(row => listRows.push(row));
        // listRows = listRows.concat(field.listRows);
       } else {
         this.findListRowsOfBranches(field.children, listRows);
       }
    });
  }

  // private calcValues1(leftViewArrayLines: FieldBranch[][],
  //                    leftFieldTree: FieldBranch[],
  //                    topFieldTree: FieldBranch[],
  //                    listResultsData: ListResultsData) {
  // }
  //

  // private calcValues(leftViewArrayLines: FieldBranch[][],
  //                    valueLinesList: Array<Array<Array<string[]>>>,
  //                    columns: ListComponentFieldDTO[]) {
  //   console.log(valueLinesList);
  //   for (let i = 0; i < leftViewArrayLines.length; i++) {
  //     valueLinesList[i].forEach(cellLines => {
  //       columns.forEach(column => {
  //         const maxValue = Math.max(...cellLines.map(line => line[column.code]));
  //         const branch = new FieldBranch();
  //         branch.id = 0;
  //         branch.code = column.code;
  //         branch.displayValue = maxValue.toString();
  //         // branch.value = maxValue;
  //         if (cellLines.length === 0) {
  //           branch.type = 'empty-value';
  //         } else {
  //           branch.type = 'value';
  //         }
  //         branch.visible = true;
  //         leftViewArrayLines[i].push(branch);
  //       });
  //     });
  //   }
  // }

  // private calcValueLinesToLeftViewArrayLines(leftViewArrayLines: FieldBranch[][],
  //                                            valueLinesList: Array<Array<Array<string[]>>>,
  //                                            columns: ListComponentFieldDTO[]) {
  //   for (let i = 0; i < leftViewArrayLines.length; i++) {
  //     valueLinesList[i].forEach(cellLines => {
  //       columns.forEach(column => {
  //         const maxValue = Math.max(...cellLines.map(line => line[column.code]));
  //         const branch = new FieldBranch();
  //         branch.id = 0;
  //         branch.code = column.code;
  //         branch.displayValue = maxValue.toString();
  //         // branch.value = maxValue;
  //         if (cellLines.length === 0) {
  //           branch.type = 'empty-value';
  //         } else {
  //           branch.type = 'value';
  //         }
  //         branch.visible = true;
  //         leftViewArrayLines[i].push(branch);
  //       });
  //     });
  //   }
  // }

  private filterRows(listRows: Array<string[]>,
                     arrayLine: FieldBranch[]): Array<string[]> {

    const filteredListRows: Array<string[]> = [];

    arrayLine.forEach(topBranch => {

      listRows.forEach(row => {
        const fieldValue = row[topBranch.code];
        if (fieldValue === topBranch.displayValue) {
          filteredListRows.push(row);
        }
      });
      listRows = filteredListRows;

    });

    return listRows;
  }

  private setDafaultCommandParams() {
    this.getParams('DEFAULTS')
      .forEach((value: string, key: string) => {
        this.listDto
          .listComponentFilterFieldList
          .filter(x => x.code === key)
          .forEach(x => x.fieldValue = value);

        this.listDto
          .listComponentColumnFieldList
          .filter(x => x.code === key)
          .forEach(x => x.fieldValue = value);
      });
  }

  private clearValuesToListComponentLeftGroupFieldList() {
    for (const leftGroupingField of this.listDto.listComponentLeftGroupFieldList) {
      leftGroupingField.fieldValue = '';
    }
  }

  private setValueToListComponentLeftGroupFieldList(code: string, value: any) {
    for (const leftGroupingField of this.listDto.listComponentLeftGroupFieldList) {
      if (leftGroupingField.code === code) {
        leftGroupingField.fieldValue = value;
      }
    }
  }

  private findContorlField(elements: HTMLCollection) {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains('ctrl-field')) {

        (elements[i] as HTMLElement).focus();
        return true;
      }
    }

    for (let i = 0; i < elements.length; i++) {
      const found = this.findContorlField((elements[i] as HTMLElement).children);
      if (found) {
        return true;
      }
    }

    return false;
  }

  private calcValueBranch(columnField: ListComponentFieldDTO,
                          rows: Array<string[]>,
                          leftArrayLine: FieldBranch[],
                          topArrayLine: FieldBranch[]): FieldBranch {

    let branch = this.listScriptsService.calcPivotValueBranch(this.listDto.id, columnField, rows, leftArrayLine, topArrayLine);
    if (branch == null) {
      branch = new FieldBranch();
      branch.displayValue = '';
      branch.type = 'empty-value';
    }
    branch.colspan = 1;
    branch.rowspan = 1;

    return branch;
  }

  private editChildBranchesVisibility(fields: FieldBranch[], isHidden: boolean) {
    fields.forEach(field => {
      field.isHiddenByParrent = isHidden;
      this.editChildBranchesVisibility(field.children, isHidden);
    });
  }

  // private editVisibleChildBranches(children: FieldBranch[]) {
  //   children.forEach(childBranch => {
  //     childBranch.hiddenByParrent = false;
  //     if (childBranch.visible)  this.editChildBranchVisibility(childBranch.children);
  //   });
  // }

}
