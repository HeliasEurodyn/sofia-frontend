import {MenuDTO} from '../menu/menuDTO';
import {BaseDTO} from '../common/base-dto';

export class UserDto extends BaseDTO {

  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  status: string;
  dateFormat: string;
  menu: MenuDTO = new MenuDTO();

}
