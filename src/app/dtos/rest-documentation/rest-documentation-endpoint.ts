
import { BaseDTO } from "../common/base-dto";
import {ListDTO} from "../list/list-dto";
import {FormDto} from "../form/form-dto";
import { ListComponentFieldDTO } from "../list/list-component-field-d-t-o";

export class RestDocumentationEndpoint extends BaseDTO{

    title: string;
    description: string;
    type: string;
    jsonUrl: string;
    method: string;
    list: ListDTO;
    form: FormDto;

    selectionId: string;

    restResults: string;
    jsonString: string;


    public listComponentFilterFieldList: ListComponentFieldDTO[] = [];

}
