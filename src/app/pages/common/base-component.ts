export class BaseComponent {
  pageId: string;

  constructor() {
    this.pageId = 'test';
  }

  setPageId(pageId) {
    this.pageId = pageId
  }
}
