import {Component, OnInit} from '@angular/core';
import {PageComponent} from '../../page/page-component';
import {FormDto} from '../../../dtos/form/form-dto';
import {FormTabDto} from '../../../dtos/form/form-tab-dto';
import {BaseDTO} from '../../../dtos/common/base-dto';
import {FormArea} from '../../../dtos/form/form-area';
import {TableComponentService} from '../../../services/crud/table-component.service';
import {FormComponentFieldDTO} from '../../../dtos/form/form-component-field-dto';
import {ComponentPersistEntityDTO} from '../../../dtos/component/component-persist-entity-dto';
import {ComponentPersistEntityFieldDTO} from '../../../dtos/component/component-persist-entity-field-dto';
import {FormComponentDto} from '../../../dtos/form/form-component-dto';
import {FormService} from '../../../services/crud/form.service';
import {CommandNavigatorService} from '../../../services/command-navigator.service';
import {FormScript} from '../../../dtos/form/form-script';

@Component({
  selector: 'app-form-designer-form',
  templateUrl: './form-designer-form.component.html',
  styleUrls: ['./form-designer-form.component.css']
})
export class FormDesignerFormComponent extends PageComponent implements OnInit {

  public mode: string;
  public dto: FormDto;

  public description: string;
  public selectedFormTab: FormTabDto
  public selectedFormArea: FormArea = new FormArea();
  public selectedformScript: FormScript ;
  public selectedFormcomponent: FormComponentDto = new FormComponentDto();
  public components: any;
  public visibleSection = 'settings';

  constructor(private service: FormService,
              private tableComponentService: TableComponentService,
              private navigatorService: CommandNavigatorService) {
    super();
  }

  ngOnInit(): void {
    let id = '0';
    this.dto = new FormDto();
    this.mode = 'new-record';

    const locateParams = this.getLocateParams();
    if (locateParams.has('ID')) {
      id = locateParams.get('ID');
      this.mode = 'edit-record';
    }

    if (this.mode === 'edit-record') {
      this.service.getById(id).subscribe(data => {
        this.dto = data;
        this.setDefaultSelectedTabs();
      });
    } else {
      this.addFormTab();
      this.addFormArea(this.selectedFormTab);
      this.setDefaultSelectedTabs();
    }

    this.refreshComponents();
  }

  refreshComponents() {
    this.tableComponentService.get().subscribe(data => {
      this.components = data;
    });
  }

  setVisibleSection(visibleSection: string) {
    this.visibleSection = visibleSection;
  }

  newTabKeyDown(event: KeyboardEvent, description: string) {
    if (event.key === 'Enter' && this.description !== '') {
      this.addFormTab();
      this.description = '';
    }
  }

  addFormTab() {
    this.selectedFormTab = new FormTabDto();
    this.selectedFormTab.shortOrder = this.getNextShortOrder(this.dto.formTabs);
    this.selectedFormTab.description = 'Tab' + this.selectedFormTab.shortOrder;
    this.dto.formTabs.push(this.selectedFormTab);
  }

  selectFormTab(formTab: FormTabDto) {
    this.selectedFormTab = formTab;
  }

  setDefaultSelectedTabs() {
    this.selectedFormTab = null;
    this.selectedFormArea = null;

    if (this.dto.formTabs.length > 0) {
      this.selectedFormTab = this.dto.formTabs[0];
    } else {
      return;
    }

    if (this.selectedFormTab.formAreas.length > 0) {
      this.selectedFormArea = this.selectedFormTab.formAreas[0];
    }
  }

  removeFormTabs(dto: FormTabDto, baseDTOs: FormTabDto[]) {
    if (dto !== undefined && baseDTOs !== undefined) {
      this.dto.formTabs =
        baseDTOs.filter(item => item !== dto);
    }
    this.setDefaultSelectedTabs();
  }

  removeFormAreas(dto: any) {
    if (dto !== undefined && this.selectedFormTab.formAreas !== undefined) {
      this.selectedFormTab.formAreas =
        this.selectedFormTab.formAreas.filter(item => item !== dto);
    }
  }

  getNextShortOrder(baseDTOs: BaseDTO[]) {
    if (baseDTOs === null
      || baseDTOs === undefined
      || baseDTOs.length === 0) {
      return 1;
    }

    const curShortOrderObject = baseDTOs.reduce(function (prev, curr) {
      return prev.shortOrder < curr.shortOrder ? curr : prev;
    });

    return (curShortOrderObject.shortOrder + 1);
  }

  addFormArea(formTab: FormTabDto) {
    this.selectedFormArea = new FormArea();
    this.selectedFormArea.shortOrder = this.getNextShortOrder(formTab.formAreas);
    this.selectedFormArea.description = 'Area' + this.selectedFormArea.shortOrder;
    this.selectedFormArea.cssclass = 'col-12';
    formTab.formAreas.push(this.selectedFormArea);
  }

  selectFormArea(formArea: FormArea) {
    this.selectedFormArea = formArea;
  }

  hideChildren(item) {
    item.showFieldList = false;
  }

  showChildren(item) {
    item.showFieldList = true;
  }

  selectComponent(selectedComponent) {
    this.dto.component = selectedComponent;
  }

  addField(row: ComponentPersistEntityDTO, field: ComponentPersistEntityFieldDTO) {
    const formComponentField = new FormComponentFieldDTO();
    const formComponent = new FormComponentDto();
    formComponent.formComponentField = formComponentField;
    formComponent.formComponentField.editor = field.editor;
    formComponent.formComponentField.componentPersistEntity = row;
    formComponent.formComponentField.componentPersistEntityField = field;
    formComponent.formComponentField.visible = true;
    formComponent.formComponentField.editable = true;
    formComponent.formComponentField.required = false;
    formComponent.formComponentField.description = field.description
    formComponent.formComponentField.type = field.persistEntityField.type;
    formComponent.type = 'field';

    formComponent.shortOrder = this.getNextShortOrder(this.selectedFormArea.formComponents);
    formComponent.cssclass = 'col-12';
    this.selectedFormArea.formComponents.push(formComponent);
  }

  save() {
    if (this.mode === 'edit-record') {
      this.service.update(this.dto).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    } else {
      this.service.save(this.dto).subscribe(data => {
        this.navigatorService.closeAndBack(this.pageId);
      });
    }
  }

  delete() {
    this.service.delete(this.dto.id).subscribe(data => {
      this.navigatorService.closeAndBack(this.pageId);
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

  addScript() {
    console.log(this.dto);
    const formScript = new FormScript();
    formScript.shortOrder = this.getNextShortOrder(this.dto.formScripts);
    formScript.name = 'Script' + formScript.shortOrder;
    this.dto.formScripts.push(formScript);
  }

  removeEntityFormList(entity: any, list: any[]) {
    list =
      list.filter(item => item !== entity);
    return list;
  }

  removeFormScriptByField(formScript: FormScript) {
    this.dto.formScripts =
      this.dto.formScripts.filter(item => item !== formScript);
  }

  setSelectedFormScript(formScript: FormScript) {
    this.selectedformScript = formScript;
  }

  moveUp(baseDTO: BaseDTO, baseDTOs: BaseDTO[]) {
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

  moveDown(baseDTO: BaseDTO, baseDTOs: BaseDTO[]) {
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

  setSelectedField(formcomponent: FormComponentDto) {
    this.selectedFormcomponent = formcomponent;
  }
}
