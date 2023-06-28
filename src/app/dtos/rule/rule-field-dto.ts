import {BaseDTO} from "../common/base-dto";

export class RuleFieldDTO  extends BaseDTO {

  code: string;

  name: string;

  description: string;

  constructor() {
    super();
  }
}
