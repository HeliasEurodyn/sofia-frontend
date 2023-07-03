import {BaseDTO} from "../common/base-dto";
import {RuleFieldDTO} from "./rule-field-dto";
import {RuleOperatorDTO} from "./rule-operator-dto";

export class RuleDTO extends BaseDTO {

  code: string;

  name: string;

  description: string;

  ruleExpressionList: RuleExpressionDTO[] = [];

  expressionPreview = '';

  emptyExpressionFound = false;

  constructor() {
    super();
  }

}

export class RuleExpressionDTO extends BaseDTO {

  fieldCode: string;

  fieldName: string;

  operatorCode: string;

  operatorName: string;

  public command: string;

  childrenColor: string = '';

  color: string = '';

  ruleExpressionList: RuleExpressionDTO[] = [];

  expanded: Boolean = false;

  joinType: string = "and";

  childrenJoinType: string = "and";


  ruleField: RuleFieldDTO;

  ruleOperator: RuleOperatorDTO;

  constructor() {
    super();
  }

}
