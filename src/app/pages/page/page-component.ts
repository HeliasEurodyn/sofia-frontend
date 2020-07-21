export class PageComponent {

  public pageId: string;
  public title: string;
  public params: Map<string, string> = new Map();

  public nextPage = null;
  public previousPage = null;

  constructor() {
  }

  onFocusIn() {
  }

  getLocateParams() {
    const locateValuesKeyValMap: Map<string, string> = new Map();
    if (this.params.has('LOCATE')) {
      const locateValues = this.params.get('LOCATE');
      let locateValuesInsideBrackets = locateValues.replace(/.*\(|\).*/, '');
      locateValuesInsideBrackets = locateValuesInsideBrackets.replace(/.*\(|\).*/, '');
      const locateValuesSplited = locateValuesInsideBrackets.split(',');


      for (const locateValueSplited of locateValuesSplited) {
        const locateValuesKeyVal: string[] = locateValueSplited.split('=');
        locateValuesKeyValMap.set(locateValuesKeyVal[0], locateValuesKeyVal[1]);
      }
    }

    return locateValuesKeyValMap;
  }


}
