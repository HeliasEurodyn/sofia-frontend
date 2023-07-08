
import { BaseDTO } from "../common/base-dto";
import {ListDTO} from "../list/list-dto";
import {FormDto} from "../form/form-dto";

export class RestDocumentationEndpoint extends BaseDTO{

    title: string;
    description: string;
    type: string;
    jsonUrl: string;
    method: string;

    list: ListDTO;
    form: FormDto;

    restResults: string;

}
