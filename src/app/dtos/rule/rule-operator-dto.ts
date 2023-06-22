import {BaseDTO} from "../common/base-dto";

export class RuleOperatorDTO extends BaseDTO {

  code: string;

  name: string;

  description: string;

  constructor() {
    super();
  }
}
