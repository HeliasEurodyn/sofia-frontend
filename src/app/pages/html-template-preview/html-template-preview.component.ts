import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HtmlTemplatePreviewService } from 'app/services/crud/html-template-preview.service';
import { PageComponent } from '../page/page-component';

@Component({
  selector: 'app-html-template-preview',
  templateUrl: './html-template-preview.component.html',
  styleUrls: ['./html-template-preview.component.css']
})
export class HtmlTemplatePreviewComponent extends PageComponent implements OnInit  {

  private html = "";

  private id = "";
  private selectionId = "";
  public visibleSection = 'preview';
  public el: String;

  constructor(private service: HtmlTemplatePreviewService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
              private domSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {

    this.initNav(this.activatedRoute);
    this.selectionId = '';
    const locateParams = this.getLocateParams();

    if (locateParams.has('ID')) {
      this.id = locateParams.get('ID');
    }

    if (locateParams.has('SELECTION-ID')) {
      this.selectionId = locateParams.get('SELECTION-ID');
    }

    this.createIframe();

      // this.service.printPreview(this.id, this.selectionId).subscribe(data => {
    //   this.html = data['html'];
    // });

  }

  createIframe() {

      const element: HTMLIFrameElement = document.createElement('iframe');
   // element.setAttribute('id', 'ttesst123');
      element.setAttribute('src',
        'http://localhost:15502/api/html-template/preview-page.html?id=' + this.id + '&selection-id=' + this.selectionId);

      element.style.display = 'none';
      document.body.appendChild(element);
     // element.click();

     // element.contentWindow.print();

   // const element2 = document.getElementById('ttesst123') as HTMLIFrameElement;
  //  element2.contentWindow.print();
   // element2.contentWindow.window.print();
  //  console.log(element2.contentWindow);
   // element.contentWindow.onafterprint()
   //   document.body.removeChild(element);
    setTimeout( ()=>{
      document.body.removeChild(element);
    },500);

  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

  printPreview() {
    let iframe = document.getElementById('frameId') as HTMLIFrameElement;

    iframe.contentWindow.print();
  }

  transform() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:15502/api/html-template/preview-page.html?id=' + this.id + '&selection-id=' + this.selectionId);
  }

  printDiv(divID) {
    //Get the HTML of div
    var divElements = document.getElementById(divID).innerHTML;
    //Get the HTML of whole page
    var oldPage = document.body.innerHTML;

    //Reset the page's HTML with div's HTML only
    document.body.innerHTML =
      "<html><head><title></title></head><body>" +
      divElements + "</body>";

    //Print Page
    window.print();

    //Restore orignal HTML
    document.body.innerHTML = oldPage;

  }

  setVisibleSection(visibleSection: string) {
    window.print();
    this.visibleSection = visibleSection;
  }

}
