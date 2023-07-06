
import { BaseDTO } from "../common/base-dto";

export class RestDocumentationEndpoint extends BaseDTO{

    title: string;
    description: string;
    type: string;
    jsonUrl: string;
    method: string;
}
