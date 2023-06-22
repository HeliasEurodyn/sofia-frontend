import {Component, ComponentRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {CommandNavigatorService} from "../../services/system/command-navigator.service";
import {BaseDTO} from "../../dtos/common/base-dto";
import {PageComponent} from "../page/page-component";
import {RuleDTO, RuleExpressionDTO} from 'app/dtos/rule/rule-d-t-o';
import {RuleService} from "../../services/crud/rule.service";
import {NotificationService} from "../../services/system/notification.service";
import {DomSanitizer} from "@angular/platform-browser";
import {RuleSettingsDTO} from "../../dtos/rule/rule-settings-dto";
import {ComponentPersistEntityFieldDTO} from "../../dtos/component/component-persist-entity-field-dto";
import {ComponentPersistEntityDTO} from "../../dtos/component/component-persist-entity-dto";
import {RuleFieldService} from "../../services/crud/rule-field.service";
import {RuleOperatorService} from "../../services/crud/rule-operator.service";

@Component({
  selector: 'app-rule-designer',
  templateUrl: './rule-designer.component.html',
  styleUrls: ['./rule-designer.component.scss']
})
export class RuleDesignerComponent extends PageComponent implements OnInit {
  mode: string;
  public dto: RuleDTO;
  public settingsDTO: RuleSettingsDTO;
  public  showSaveButton = false;

  @Input() command: string;
  @Input() public componentPersistEntityFieldDTO: ComponentPersistEntityFieldDTO;
  @Input() public componentPersistEntityDTO: ComponentPersistEntityDTO;
  @Input() fieldId: string;
  @Input() editable: Boolean;
  @Output() eventOccured = new EventEmitter<any>();

  linecounter = 0;

  public visibleSection = 'general';

  constructor(private activatedRoute: ActivatedRoute,
              private service: RuleService,
              private router: Router,
              private location: Location,
              private navigatorService: CommandNavigatorService,
              private notificationService: NotificationService,
              private sanitizer: DomSanitizer,
              private commandNavigatorService: CommandNavigatorService,
              private ruleFieldService: RuleFieldService,
              private ruleOperatorService: RuleOperatorService,
              ) {
    super();
  }

  ngOnInit(): void {
    this.initNav(this.activatedRoute);
    this.refresh();
  }

  public refresh(): void {

    let id = '';
    let selectionId = '';

    this.mode = 'new-record';
    this.dto = new RuleDTO();
    this.settingsDTO = new RuleSettingsDTO();

    const locateParams: Map<string, string> = this.commandParserService.parse(this.command);

    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
    }

    if(locateParams.get('SHOW-SAVE-BUTTON') === 'YES'){
      this.showSaveButton = true;
    }

    if (this.componentPersistEntityFieldDTO.value) {
      selectionId = this.componentPersistEntityFieldDTO.value;
      this.mode = 'edit-record';
    }

    this.service.getSettingsById(id).subscribe(data => {
      this.settingsDTO = data;
    });

    if (this.mode === 'edit-record') {
      this.service.getById(selectionId).subscribe(data => {
        this.dto = data;

        if (this.dto.ruleExpressionList != null) {
          this.expandAll(this.dto.ruleExpressionList);
        }

        this.cleanIdsIfCloneEnabled();
      });
    }
  }

  private expandAll(ruleExpressionList: RuleExpressionDTO[]) {
    if (ruleExpressionList != null) {
      ruleExpressionList.forEach(x => {
        x.expanded = true;
        if (x.ruleExpressionList != null) {
          this.expandAll(x.ruleExpressionList);
        }
      });
    }
  }

  cleanIdsIfCloneEnabled() {
    if (this.params.has('TYPE')) {

      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {

        this.dto.id = null;
        this.dto.version = null;
        if (this.dto.ruleExpressionList != null) {
          this.cleanFieldListIdsIfCloneEnabled(this.dto.ruleExpressionList);
        }
        this.mode = 'new-record';
      }
    }
  }

  cleanFieldListIdsIfCloneEnabled(ruleExpressionDTOS: RuleExpressionDTO[]) {
    if (this.params.has('TYPE')) {
      if (this.params.get('TYPE').toUpperCase() === 'CLONE') {
        for (const ruleExpressionDTO of ruleExpressionDTOS) {
          ruleExpressionDTO.id = null;
          ruleExpressionDTO.version = null;
          if (ruleExpressionDTO.ruleExpressionList != null) {
            this.cleanFieldListIdsIfCloneEnabled(ruleExpressionDTO.ruleExpressionList);
          }
        }
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

  selectField(ruleExpressionDTO: RuleExpressionDTO) {
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.navigate(this.settingsDTO.fieldCommand);
    componentRefOnNavigation.instance.setPresetCommand(this.settingsDTO.fieldCommand);
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
      console.log(returningValues);
      this.ruleFieldService.getById(returningValues['RETURN']).subscribe(ruleField => {
        ruleExpressionDTO.ruleField = ruleField;
      });
    });
  }

  selectOperator(ruleExpressionDTO: RuleExpressionDTO) {
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.navigate(this.settingsDTO.operatorCommand);
    componentRefOnNavigation.instance.setPresetCommand(this.settingsDTO.operatorCommand);
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
      this.ruleOperatorService.getById(returningValues['RETURN']).subscribe(ruleOperator => {
        ruleExpressionDTO.ruleOperator = ruleOperator;
      });
    });
  }

  addMenuField(selectedParentMenuFieldComponent: RuleExpressionDTO) {
    this.linecounter++;

    const ruleExpressionDTO = new RuleExpressionDTO();
    ruleExpressionDTO.expanded = true;
    ruleExpressionDTO.ruleExpressionList = [];
    ruleExpressionDTO.shortOrder = this.linecounter;
    ruleExpressionDTO.childrenColor = this.getRandomColor();

    if (selectedParentMenuFieldComponent == null) {
      ruleExpressionDTO.color = '#FDEDD7';
      this.dto.ruleExpressionList.push(ruleExpressionDTO);
    } else {
      selectedParentMenuFieldComponent.expanded = true;
      selectedParentMenuFieldComponent.ruleExpressionList.push(ruleExpressionDTO);
      ruleExpressionDTO.color = selectedParentMenuFieldComponent.childrenColor;
    }
  }

  getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  removeRuleExpression(selectedRuleExpressionDTO: RuleExpressionDTO, ruleExpressionDTOS: RuleExpressionDTO[]) {
    if (ruleExpressionDTOS === undefined) {
      return;
    }

    if (ruleExpressionDTOS.indexOf(selectedRuleExpressionDTO) >= 0) {
      ruleExpressionDTOS.splice(ruleExpressionDTOS.indexOf(selectedRuleExpressionDTO), 1);
    }

    for (const ruleExpressionDTO of ruleExpressionDTOS) {
      this.removeRuleExpression(selectedRuleExpressionDTO, ruleExpressionDTO.ruleExpressionList);
    }
  }

  upItemInList(baseDTO: BaseDTO, baseDTOs: BaseDTO[]) {
    let position = 0;
    for (const listBaseDTO of baseDTOs) {
      if (baseDTO === listBaseDTO && position > 0) {
        const prevItem = baseDTOs[position - 1];
        baseDTOs[position] = prevItem;
        baseDTOs[position - 1] = listBaseDTO;
      }
      position++;
    }
  }

  downItemInList(baseDTO: BaseDTO, baseDTOs: BaseDTO[]) {
    let position = 0;
    for (const listBaseDTO of baseDTOs) {
      if (baseDTO === listBaseDTO && (position + 1) < baseDTOs.length) {
        const nextItem = baseDTOs[position + 1];
        baseDTOs[position] = nextItem;
        baseDTOs[position + 1] = listBaseDTO;
        break;
      }
      position++;
    }
  }

  save(callback) {
    const emptyExpressionFound = this.checkEmptyExpressionFields(this.dto.ruleExpressionList);
    if (emptyExpressionFound) {
      this.dto.emptyExpressionFound = true;
    }else {
      this.dto.emptyExpressionFound = false;
    }

    let rulePreview = this.createExpressionPreview(this.dto.ruleExpressionList);
    this.dto.expressionPreview = rulePreview;

    this.dto.ruleExpressionList = this.updateShortOrderAndClearParrents(this.dto.ruleExpressionList);

    if (this.mode === 'edit-record') {
      this.service.update(this.dto).subscribe((data: RuleDTO) => {
          this.dto = data;
          this.componentPersistEntityFieldDTO.value =this.dto.id;

          if (this.dto.ruleExpressionList != null) {
            this.expandAll(this.dto.ruleExpressionList);
          }

          if(callback != null) callback(data);
      });
    } else {
      this.service.save(this.dto).subscribe((data: RuleDTO) => {
          this.dto = data;
          this.componentPersistEntityFieldDTO.value =this.dto.id;

          if (this.dto.ruleExpressionList != null) {
            this.expandAll(this.dto.ruleExpressionList);
          }

         if(callback != null) callback(data);

          this.mode = 'edit-record';
      });
    }

  }

  updateShortOrderAndClearParrents(ruleExpressionList: RuleExpressionDTO[]) {
    if (ruleExpressionList == null) {
      return null;
    }

    let shortOrder = 1;
    for (const ruleExpression of ruleExpressionList) {
      ruleExpression.shortOrder = shortOrder;
      if (ruleExpression.ruleExpressionList != null) {
        ruleExpression.ruleExpressionList = this.updateShortOrderAndClearParrents(ruleExpression.ruleExpressionList);
      }
      shortOrder++;
    }
    return ruleExpressionList;
  }

  delete() {
    this.service.delete(this.dto.id).subscribe(data => {
      this.location.back();
    });
  }

  hasChildren(item: RuleExpressionDTO) {
    if (item.ruleExpressionList == null) {
      return false;
    }

    if (item.ruleExpressionList.length === 0) {
      return false;
    }

    return true;
  }

  hideChildren(item: RuleExpressionDTO) {
    item.expanded = false;
  }

  showChildren(item: RuleExpressionDTO) {
    item.expanded = true;
  }

  setVisibleSection(visibleSection: string) {
    this.visibleSection = visibleSection;
  }

  createPreview() {
    // const emptyFound = this.checkEmptyExpressionFields(this.dto.ruleExpressionList)
    // if (emptyFound) {
    //   this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-exclamation', 'There are empty fields on the expression! <br> Fill them to be able to Preview or Save!');
    //   return;
    // }

    let rulePreview = this.createExpressionPreview(this.dto.ruleExpressionList);
    this.dto.expressionPreview = rulePreview;
    document.getElementById('openPreviewButton').click();
  }

  checkEmptyExpressionFields(ruleExpressionList: RuleExpressionDTO[]): boolean {

    for (const item of ruleExpressionList) {
      if (item.fieldName == null || item.fieldName == '' ||
        item.operatorName == null || item.operatorName == '' ||
        item.command == null || item.command == '') {
        return true;
      }

      if (item.ruleExpressionList != null && item.ruleExpressionList.length > 0) {
        const emptyFound = this.checkEmptyExpressionFields(item.ruleExpressionList);
        if (emptyFound) {
          return true;
        }
      }

    }

    return false;
  }

  createExpressionPreview(ruleExpressionList: RuleExpressionDTO[]) {
    let rulePreview = '';

    ruleExpressionList.forEach((item, index) => {

      if (item.ruleExpressionList != null && item.ruleExpressionList.length > 0) {
        rulePreview += `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">(</b></button>`;
      }


      let joinType = '';
      if (item.joinType == 'and') {
        joinType = `<button class="btn" class="col" style="border: 2px solid ${item.color}; padding: 6px;"><b style="color: #0c5460">AND</b></button>`;
      } else {
        joinType = `<button class="btn" class="col" style="border: 2px solid ${item.color}; padding: 6px;"><b style="color: #0c5460">OR</b></button>`;
      }

      if (index === ruleExpressionList.length - 1) {
        joinType = '';
      }

      let fieldName = item.ruleField?.name || '<span style="color: #ff4b4b">empty-field</span>';
      let operatorName = item.ruleOperator?.name || '<span style="color: #ff4b4b">empty-operator</span>';
      let command = item.command || '<span style="color: #ff4b4b">empty-expression</span>';

      rulePreview += `
        <button class="btn btn-round" style="border: 2px solid ${item.color}; padding: 6px;">
          <b style="color: #385f89">${fieldName}</b>
          <b style="color: #476636">${operatorName}</b>
          <b style="color: #385f89">${command}</b>
        </button>`;

      if (item.ruleExpressionList != null && item.ruleExpressionList.length > 0) {

        let childrenJoinType = '';
        if (item.childrenJoinType == 'and') {
          childrenJoinType = `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">AND</b></button>`;
        } else {
          childrenJoinType = `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">OR</b></button>`;
        }
        rulePreview += childrenJoinType;

        rulePreview += this.createExpressionPreview(item.ruleExpressionList);
        rulePreview += `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">)</b></button>`;
      }

      rulePreview +=
        `${joinType}`;

    });

    return rulePreview;
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }
}
