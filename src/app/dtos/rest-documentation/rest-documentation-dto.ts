import { BaseDTO } from "../common/base-dto";
import { RestDocumentationEndpoint } from "./rest-documentation-endpoint";

export class RestDocumentationDto extends BaseDTO{
    title: string;
    description: string;
    active: boolean;

    public restDocumentationEndpoints: RestDocumentationEndpoint[] = [];
}
