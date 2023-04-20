import {Component, ComponentRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {CommandNavigatorService} from "../../services/system/command-navigator.service";
import {BaseDTO} from "../../dtos/common/base-dto";
import {PageComponent} from "../page/page-component";
import {RuleDTO, RuleExpressionDTO} from 'app/dtos/rule/rule-d-t-o';
import {RuleService} from "../../services/crud/rule.service";
import {NotificationService} from "../../services/system/notification.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {RuleSettingsDTO} from "../../dtos/rule/rule-settings-dto";

@Component({
  selector: 'app-rule-designer',
  templateUrl: './rule-designer.component.html',
  styleUrls: ['./rule-designer.component.scss']
})
export class RuleDesignerComponent extends PageComponent implements OnInit {
  mode: string;
  public dto: RuleDTO;
  public settingsDTO: RuleSettingsDTO;


 // public ruleExpressionDTO: RuleExpressionDTO;

  linecounter = 0;

  public visibleSection = 'general';

  constructor(private activatedRoute: ActivatedRoute,
              private service: RuleService,
              private router: Router,
              private location: Location,
              private navigatorService: CommandNavigatorService,
              private notificationService: NotificationService,
              private sanitizer: DomSanitizer,
              private commandNavigatorService: CommandNavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.initNav(this.activatedRoute);

    let id = '';
    let selectionId = '';

    this.mode = 'new-record';
    this.dto = new RuleDTO();
    this.settingsDTO = new RuleSettingsDTO();
   // this.ruleExpressionDTO = new RuleExpressionDTO();

    const locateParams = this.getLocateParams();

    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
    }

    if (locateParams.has('SELECTION-ID')) {
      selectionId = locateParams.get('SELECTION-ID');
      this.mode = 'edit-record';
    }

    this.service.getSettingsById(id).subscribe(data => {
      this.settingsDTO = data;
    });

    if (this.mode === 'edit-record') {
      this.service.getById(selectionId).subscribe(data => {
        this.dto = data;

        if(this.dto.ruleExpressionList != null){
          this.expandAll(this.dto.ruleExpressionList);
        }

        this.cleanIdsIfCloneEnabled();
      });
    }
  }

  private expandAll(ruleExpressionList: RuleExpressionDTO[]) {
    if(ruleExpressionList != null){
      ruleExpressionList.forEach(x => {
        x.expanded = true;
        if(x.ruleExpressionList != null){
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
      ruleExpressionDTO.fieldCode = returningValues['RETURN'];
      ruleExpressionDTO.fieldName = returningValues['RETURN-DISLPAY'];
    });
  }

  selectOperator(ruleExpressionDTO: RuleExpressionDTO) {
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.navigate(this.settingsDTO.operatorCommand);
    componentRefOnNavigation.instance.setPresetCommand(this.settingsDTO.operatorCommand);
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
      ruleExpressionDTO.operatorCode = returningValues['RETURN'];
      ruleExpressionDTO.operatorName = returningValues['RETURN-DISLPAY'];
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

  save() {


    if(this.dto.code == null || this.dto.code == '' ){
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-exclamation', 'The Code Field Cannot be empty!');
      return;
    }

    if(this.dto.name == null || this.dto.name == '' ){
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-exclamation', 'The Name Field Cannot be empty!');
      return;
    }

    const emptyExpressionFound = this.checkEmptyExpressionFields(this.dto.ruleExpressionList);
    if(emptyExpressionFound){
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-exclamation', 'There are empty fields on the expression! <br> Fill them to be able to Save!');
      return;
    }

    let rulePreview = this.createExpressionPreview(this.dto.ruleExpressionList);
    this.dto.expressionPreview = rulePreview;

    this.dto.ruleExpressionList = this.updateShortOrderAndClearParrents(this.dto.ruleExpressionList);

    if (this.mode === 'edit-record') {
      this.service.update(this.dto).subscribe(data => {
        this.location.back();
      });
    } else {
      this.service.save(this.dto).subscribe(data => {
        this.location.back();
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

  // setRuleField(field: string) {
  //   this.ruleExpressionDTO.fieldName = field;
  // }

  // setOperatorField(operator: string) {
  //   this.ruleExpressionDTO.operatorName = operator;
  // }

  createPreview() {

    const emptyFound = this.checkEmptyExpressionFields(this.dto.ruleExpressionList)
    if(emptyFound){
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-exclamation', 'There are empty fields on the expression! <br> Fill them to be able to Preview or Save!');
      return;
    }

    let rulePreview = this.createExpressionPreview(this.dto.ruleExpressionList);
    this.dto.expressionPreview = rulePreview;
    document.getElementById('openPreviewButton').click();
  }

  checkEmptyExpressionFields(ruleExpressionList: RuleExpressionDTO[]) :boolean {

    for (const item of ruleExpressionList) {
      if(item.fieldName == null || item.fieldName == '' ||
        item.operatorName == null || item.operatorName == '' ||
        item.command == null || item.command == ''){
        return true;
      }

      if(item.ruleExpressionList != null && item.ruleExpressionList.length > 0){
        const emptyFound = this.checkEmptyExpressionFields(item.ruleExpressionList);
        if(emptyFound){
        return true;
        }
      }

    }

    return false;
  }

  createExpressionPreview(ruleExpressionList: RuleExpressionDTO[]) {
    let rulePreview = '';

    ruleExpressionList.forEach((item, index) => {

      let joinType = '';
      if(item.joinType == 'and'){
        joinType = `<button class="btn" class="col" style="border: 2px solid ${item.color}; padding: 6px;"><b style="color: #0c5460">AND</b></button>`;
      } else {
        joinType = `<button class="btn" class="col" style="border: 2px solid ${item.color}; padding: 6px;"><b style="color: #0c5460">OR</b></button>`;
      }

      if (index === ruleExpressionList.length - 1) {
        joinType = '';
      }

      rulePreview +=
        `<button class="btn btn-round" style="border: 2px solid ${item.color}; padding: 6px;"> `
      rulePreview +=
        `<b style="color: #385f89"> ${item.fieldName}</b>`;
      rulePreview +=
        ` <b style="color: #476636">${item.operatorName}</b>` ;

      rulePreview +=
        ` <b style="color: #385f89"> ${item.command}  </b> </button>` ;

      if(item.ruleExpressionList != null && item.ruleExpressionList.length > 0){

        let childrenJoinType = '';
        if(item.childrenJoinType == 'and'){
          childrenJoinType = `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">AND</b></button>`;
        } else {
          childrenJoinType = `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">OR</b></button>`;
        }
        rulePreview += childrenJoinType;

        rulePreview += `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">(</b></button>`;
        rulePreview += this.createExpressionPreview(item.ruleExpressionList);
        rulePreview += `<button class="btn" class="col" style="border: 2px solid ${item.childrenColor};background-color: ${item.color}; padding: 6px;"><b style="color: #0c5460">)</b></button>`;
      }

      rulePreview +=
        `${joinType}` ;

    });

   return rulePreview;
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }
}
