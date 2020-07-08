import {BaseDTO} from '../common/base-dto';
import {ComponentPersistEntityDTO} from './component-persist-entity-dto';

export class ComponentDTO extends BaseDTO {
  name: string;
  description: string;
  public componentPersistEntityList: ComponentPersistEntityDTO[] = [];
}
